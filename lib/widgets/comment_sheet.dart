import 'package:flutter/material.dart';

typedef OnSend = Future<void> Function(String text);

class CommentSheet extends StatefulWidget {
  const CommentSheet({super.key, required this.onSend});
  final OnSend onSend;

  @override
  State<CommentSheet> createState() => _CommentSheetState();
}

class _CommentSheetState extends State<CommentSheet> {
  final _ctl = TextEditingController();
  bool _sending = false;

  Future<void> _send() async {
    if (_ctl.text.trim().isEmpty || _sending) return;
    setState(() => _sending = true);
    await widget.onSend(_ctl.text.trim());
    if (mounted) {
      _ctl.clear();
      setState(() => _sending = false);
      Navigator.pop(context);               // close sheet
    }
  }

  @override
  Widget build(BuildContext context) => Padding(
        padding: MediaQuery.of(context).viewInsets, // push above keyboard
        child: SafeArea(
          top: false,
          child: Row(
            children: [
              Expanded(
                child: TextField(
                  controller: _ctl,
                  maxLines: 3,
                  minLines: 1,
                  decoration: const InputDecoration(
                    hintText: 'Add a comment…',
                    border: InputBorder.none,
                    contentPadding: EdgeInsets.symmetric(horizontal: 14),
                  ),
                ),
              ),
              IconButton(
                icon: _sending
                    ? const SizedBox(
                        width: 18, height: 18,
                        child: CircularProgressIndicator(strokeWidth: 2))
                    : const Icon(Icons.send),
                onPressed: _send,
              ),
            ],
          ),
        ),
      );
}
