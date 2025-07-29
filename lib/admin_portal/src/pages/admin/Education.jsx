import React, { Fragment, useEffect, useState } from "react";
import { api } from "../../lib/api";

const THEME      = "#2FAC40";              // brand-green
const FEED_WIDTH = "540px";
const PAGE_SIZE  = 8;
const cx = (...c) => c.filter(Boolean).join(" ");

export default function Education() {
  /* feed state */
  const [posts, setPosts]   = useState([]);
  const [skip,  setSkip]    = useState(0);
  const [busy,  setBusy]    = useState(false);
  const [hasMore, setMore]  = useState(true);
  const [error, setError]   = useState("");

  /* ui state */
  const [showCreate, setShowCreate] = useState(false);
  const [showDelete, setShowDelete] = useState(null);
  const [openComments, setOpenComments] = useState(null);

  /* create-form */
  const [kind, setKind]     = useState("image");
  const [title,setTitle]    = useState("");
  const [desc, setDesc]     = useState("");
  const [file, setFile]     = useState(null);
  const [thumb,setThumb]    = useState(null);
  const [sending,setSend]   = useState(false);
  const [progress,setProg]  = useState(0);

  /* ─── fetch paginated ─── */
  async function fetchPage(initial=false) {
    if (busy && !initial) return;
    setBusy(true);
    try {
      const { data } = await api.get(
        `/education?sort=-createdAt&skip=${initial?0:skip}&limit=${PAGE_SIZE}`
      );
      setPosts(initial ? data : [...posts, ...data]);
      setSkip(initial ? data.length : skip + data.length);
      setMore(data.length === PAGE_SIZE);
    } catch { setError("Could not load posts."); }
    finally { setBusy(false); }
  }
  useEffect(()=>{ fetchPage(true); }, []);

  /* ─── like / unlike ─── */
  async function toggleLike(id){
    setPosts(ps=>ps.map(p=>p._id===id
      ? {...p,
          liked: !p.liked,
          likes: Array.isArray(p.likes)
            ? (p.liked ? p.likes.slice(0,-1) : [...p.likes,"me"])
            : (p.liked ? p.likes-1 : p.likes+1)}
      : p));
    try{ await api.put(`/education/${id}/like`);}catch{}
  }

  /* ─── comment add ─── */
  async function addComment(id,text){
    if(!text.trim()) return;
    try{
      const {data} = await api.post(`/education/${id}/comment`,{text});
      setPosts(ps=>ps.map(p=>p._id===id
        ? {...p,
            commentsArr:[...(p.commentsArr||[]),data],
            comments: Array.isArray(p.comments)
              ? [...p.comments,data]
              : p.comments+1}
        :p));
    }catch{ setError("Comment failed."); }
  }

  /* ─── create post ─── */
  async function createPost(e){
    e.preventDefault();
    if(!file) return;
    setSend(true); setProg(0);
    const fd=new FormData();
    fd.append("file",file);
    if(kind==="video"&&thumb) fd.append("thumb",thumb);
    fd.append("kind",kind); fd.append("title",title); fd.append("description",desc);
    try{
      await api.post("/admin/education",fd,{
        headers:{ "Content-Type":"multipart/form-data"},
        onUploadProgress:e=>setProg(Math.round(e.loaded*100/e.total))
      });
      setShowCreate(false);
      setKind("image"); setTitle(""); setDesc(""); setFile(null); setThumb(null);
      fetchPage(true);
    }catch{ setError("Upload failed."); }
    finally{ setSend(false); setProg(0);}
  }

  /* ─── delete ─── */
  async function deletePost(id){
    try{ await api.delete(`/admin/education/${id}`); }
    catch{ setError("Delete failed."); }
    setPosts(ps=>ps.filter(p=>p._id!==id));
    setShowDelete(null);
  }

  /* helpers for counts */
  const likeCount = l => Array.isArray(l) ? l.length : l;
  const commentCount = c => Array.isArray(c) ? c.length : c;

  /* ─── UI ─── */
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6">

      {error && (
        <div className="fixed top-6 right-6 bg-red-600 text-white px-4 py-2 rounded shadow">
          {error}
        </div>
      )}

      <header className="w-full max-w-screen-md flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Education Library</h1>
        <button
          onClick={()=>setShowCreate(true)}
          className="px-4 py-2 bg-[color:var(--tw-theme)] text-white rounded font-medium"
          style={{"--tw-theme":THEME}}
        >+ New Post</button>
      </header>

      <section className="w-full flex flex-col items-center gap-6">
        {posts.map(p=>(
          <article key={p._id}
            className="w-full bg-white border rounded-xl shadow-sm overflow-hidden"
            style={{maxWidth:FEED_WIDTH}}
          >
            <div className="aspect-video bg-gray-100">
              {p.kind==="image"
                ? <img src={p.fileUrl} alt={p.title} className="object-cover w-full h-full"/>
                : <video
  src={p.fileUrl}
  poster={p.thumbUrl}
  controls
  preload="metadata"              // 👈 stops full download on first render
  style={{ objectFit: 'cover', width: '100%', height: '100%' }}
/>
}
            </div>

            <div className="p-4 space-y-2">
              <div className="flex justify-between">
                <h2 className="font-semibold truncate">{p.title}</h2>
                <button
                  className="text-gray-500 hover:text-red-600 px-1"
                  onClick={()=>setShowDelete(p._id)}
                >⋯</button>
              </div>

              {p.description && <p className="text-sm text-gray-700">{p.description}</p>}

              <div className="flex gap-6 text-sm pt-1">
                <button onClick={()=>toggleLike(p._id)} className="flex items-center gap-1">
                  <span className={cx(p.liked?"text-red-600":"text-gray-600")}>
                    {p.liked?"❤️":"🤍"}
                  </span>{likeCount(p.likes)}
                </button>
                <button
                  onClick={()=>setOpenComments(openComments===p._id?null:p._id)}
                  className="flex items-center gap-1 text-gray-600"
                >💬 {commentCount(p.comments)}</button>
              </div>

              {openComments===p._id && (
                <CommentDrawer post={p} onAdd={t=>addComment(p._id,t)}/>
              )}
            </div>
          </article>
        ))}

        {!busy && posts.length===0 && (
          <p className="text-gray-500">No posts yet.</p>
        )}

        {hasMore && posts.length>0 && (
          <button
            onClick={()=>fetchPage(false)}
            disabled={busy}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-sm"
          >{busy?"Loading…":"Load more"}</button>
        )}
      </section>

      {showCreate && (
        <CreateModal
          {...{kind,setKind,title,setTitle,desc,setDesc,file,setFile,thumb,setThumb,
              sending: sending, progress:progress,
              createPost, onClose:()=>!sending&&setShowCreate(false)}}
        />
      )}
      {showDelete && (
        <DeleteModal
          onConfirm={()=>deletePost(showDelete)}
          onClose={()=>setShowDelete(null)}
        />
      )}
    </div>
  );
}

/* ---------- Comment Drawer ---------- */
function CommentDrawer({ post,onAdd }){
  const [text,setText]=useState("");
  const comments=post.commentsArr || post.comments || [];   // array
  return (
    <div className="border-t pt-2 space-y-2">
      <div className="max-h-48 overflow-y-auto space-y-2 pr-2">
        {comments.length
          ? comments.map(c=>(
              <div key={c._id} className="flex gap-2">
                <span className="font-medium">{c.user?.fullName||"Anon"}:</span>
                <span className="text-sm">{c.text}</span>
              </div>
            ))
          : <p className="text-sm text-gray-500">No comments yet.</p>}
      </div>

      <form onSubmit={e=>{e.preventDefault();onAdd(text);setText("");}} className="flex gap-2">
        <input
          value={text} onChange={e=>setText(e.target.value)}
          placeholder="Add a comment…"
          className="flex-1 border border-gray-300 rounded p-1 text-sm"
        />
        <button
          disabled={!text.trim()}
          className="px-3 text-sm text-white rounded disabled:opacity-50"
          style={{background:THEME}}
        >Post</button>
      </form>
    </div>
  );
}

/* ---------- Create Modal ---------- */
function CreateModal({kind,setKind,title,setTitle,desc,setDesc,
  file,setFile,thumb,setThumb,sending,progress,createPost,onClose})
{
  return (
    <Modal onClose={onClose}>
      <form onSubmit={createPost} className="bg-white w-full max-w-lg rounded-lg shadow-lg">
        <header className="flex justify-between items-center p-4 border-b">
          <h3 className="font-semibold">Create Post</h3>
          <button type="button" onClick={onClose} className="text-xl">×</button>
        </header>

        <div className="p-6 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <label className="space-y-1">
              <span className="text-sm font-medium">Type</span>
              <select value={kind} onChange={e=>setKind(e.target.value)}
                className="w-full border border-gray-300 rounded p-2">
                <option value="image">Image</option>
                <option value="video">Video</option>
              </select>
            </label>
            <label className="space-y-1">
              <span className="text-sm font-medium">Title</span>
              <input value={title} onChange={e=>setTitle(e.target.value)} required
                className="w-full border border-gray-300 rounded p-2"/>
            </label>
          </div>

          <label className="space-y-1 block">
            <span className="text-sm font-medium">Description</span>
            <textarea value={desc} onChange={e=>setDesc(e.target.value)}
              rows={2} className="w-full border border-gray-300 rounded p-2"/>
          </label>

          <FileDrop
            label={kind==="image"?"Select image":"Select video"}
            accept={kind==="image"?"image/*":"video/*"}
            file={file} setFile={setFile}
          />
          {kind==="video" && (
            <FileDrop label="Select thumbnail" accept="image/*" file={thumb} setFile={setThumb}/>
          )}

          {sending && (
            <div className="w-full bg-gray-200 rounded h-2 overflow-hidden">
              <div className="h-full" style={{width:`${progress}%`,background:THEME}}/>
            </div>
          )}
        </div>

        <footer className="p-4 border-t flex justify-end gap-4">
          <button type="button" onClick={onClose}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300">Cancel</button>
          <button disabled={sending}
            className="px-4 py-2 rounded text-white disabled:opacity-50"
            style={{background:THEME}}
          >{sending?"Posting…":"Post"}</button>
        </footer>
      </form>
    </Modal>
  );
}

/* ---------- Delete Modal ---------- */
function DeleteModal({onClose,onConfirm}){
  return (
    <Modal onClose={onClose}>
      <div className="bg-white w-full max-w-xs rounded-lg shadow p-6 text-center space-y-4">
        <h3 className="font-semibold text-lg">Delete this post?</h3>
        <p className="text-sm text-gray-600">This can’t be undone.</p>
        <div className="flex justify-center gap-4 pt-2">
          <button onClick={onClose}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300">Cancel</button>
          <button onClick={onConfirm}
            className="px-4 py-2 rounded text-white bg-red-600 hover:bg-red-700">Delete</button>
        </div>
      </div>
    </Modal>
  );
}

/* ---------- FileDrop ---------- */
function FileDrop({label,accept,file,setFile}){
  const [hover,setHover]=useState(false);
  return (
    <label
      onDragOver={e=>{e.preventDefault();setHover(true);}}
      onDragLeave={()=>setHover(false)}
      onDrop={e=>{e.preventDefault();setHover(false);setFile(e.dataTransfer.files[0]);}}
      className={cx(
        "border-2 border-dashed rounded flex flex-col items-center justify-center p-6 text-center",
        hover?"border-[color:var(--tw-theme)] bg-green-50":"border-gray-300 bg-gray-50"
      )}
      style={{"--tw-theme":THEME}}
    >
      {file
        ? <span className="text-sm">{file.name}</span>
        : <span className="text-sm text-gray-600">{label}</span>}
      <input type="file" accept={accept}
        onChange={e=>setFile(e.target.files[0])} className="hidden"/>
    </label>
  );
}

/* ---------- Modal shell ---------- */
function Modal({children,onClose}){
  return (
    <Fragment>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" onClick={onClose}/>
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        {children}
      </div>
    </Fragment>
  );
}
