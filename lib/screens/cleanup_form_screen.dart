import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:image_picker/image_picker.dart';
import 'package:provider/provider.dart';

import '../providers/auth_provider.dart';
import '../models/cleanup.dart';
import '../models/volunteer.dart';
import '../services/cleanup_service.dart';
import '../widgets/location_picker.dart';
import '../widgets/waste_type_selector.dart';
import '../widgets/severity_selector.dart';
import '../widgets/image_picker_grid.dart';

class CleanupFormScreen extends StatefulWidget {
  final Cleanup? cleanup;
  const CleanupFormScreen({Key? key, this.cleanup}) : super(key: key);

  @override
  State<CleanupFormScreen> createState() => _CleanupFormScreenState();
}

class _CleanupFormScreenState extends State<CleanupFormScreen> {
  /* ───── controllers & state ───── */
  final _formKey = GlobalKey<FormState>();
  final _titleCtl = TextEditingController();
  final _descCtl = TextEditingController();
  final _addressCtl = TextEditingController();

  String _wasteType = 'plastic';
  String _severity = 'moderate';
  DateTime? _date;

  LatLng? _pickedLoc;
  double? _accuracy;
  bool _loading = false;
  List<XFile> _images = [];

  List<Volunteer> _volunteers = [];
  String? _myUserId;

  /* ───── helpers ───── */
  Widget _disabledWrap(bool enabled, Widget child) =>
      enabled ? child : IgnorePointer(child: Opacity(opacity: .5, child: child));

  void _toast(String m) => Fluttertoast.showToast(
        msg: m,
        gravity: ToastGravity.BOTTOM,
        backgroundColor: Colors.black87,
        textColor: Colors.white,
      );

  /* ───── init ───── */
@override
void initState() {
  super.initState();
  debugPrint('► initState start');
  _initForm()
    .then((_) => debugPrint('► _initForm done'))
    .catchError((e) => debugPrint('► _initForm error: $e'));
  _initVolunteers()
    .then((_) => debugPrint('► _initVolunteers done'))
    .catchError((e) => debugPrint('► _initVolunteers error: $e'));
}
  Future<void> _initForm() async {
    final c = widget.cleanup;
    if (c != null) {
      _titleCtl.text = c.title;
      _descCtl.text = c.description;
      _addressCtl.text = c.location;
      _wasteType = c.wasteType;
      _severity = c.severity;
      _date = c.scheduledDate;
      if (c.latitude != null && c.longitude != null) {
        _pickedLoc = LatLng(c.latitude!, c.longitude!);
      }
    }
    _myUserId = context.read<AuthProvider>().userId;
    setState(() {});
  }

  Future<void> _initVolunteers() async {
    if (widget.cleanup == null) return;
    try {
      final list = await CleanupService.fetchVolunteers(widget.cleanup!.id);
      setState(() => _volunteers = list);
    } catch (_) {}
  }

  /* ───── submit / volunteer ───── */
  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;
    if (_images.isEmpty && widget.cleanup == null) {
      _toast('Please add at least one photo');
      return;
    }
    if (_pickedLoc == null) {
      _toast('Please select a location');
      return;
    }

    setState(() => _loading = true);
    try {
      if (widget.cleanup == null) {
        await CleanupService.createCleanup(
          _titleCtl.text,
          _descCtl.text,
          _addressCtl.text,
          _wasteType,
          _severity,
          _date,
          _images,
          latitude: _pickedLoc!.latitude,
          longitude: _pickedLoc!.longitude,
        );
        _toast('Cleanup request submitted!');
      } else {
        await CleanupService.updateCleanup(
          widget.cleanup!.id,
          _titleCtl.text,
          _descCtl.text,
          _addressCtl.text,
          _wasteType,
          _severity,
          _date,
          _images,
          latitude: _pickedLoc!.latitude,
          longitude: _pickedLoc!.longitude,
        );
        _toast('Cleanup request updated!');
      }
      if (mounted) Navigator.pop(context, true);
    } catch (e) {
      _toast('Submission failed: $e');
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  Future<void> _toggleVolunteer() async {
    if (widget.cleanup == null || _myUserId == null) return;
    setState(() => _loading = true);
    try {
      final isVol = _volunteers.any((v) => v.id == _myUserId);
      final updated = isVol
          ? await CleanupService.leaveCleanup(widget.cleanup!.id)
          : await CleanupService.joinCleanup(widget.cleanup!.id);
      setState(() => _volunteers = updated);
    } catch (e) {
      _toast('Failed: $e');
    } finally {
      setState(() => _loading = false);
    }
  }

  /// ← New: complete cleanup
  Future<void> _complete() async {
    if (widget.cleanup == null) return;
    setState(() => _loading = true);
    try {
      await CleanupService.completeCleanup(widget.cleanup!.id);
      _toast('Cleanup marked as completed');
      if (mounted) Navigator.pop(context, true);
    } catch (e) {
      _toast('Failed to complete: $e');
    } finally {
      setState(() => _loading = false);
    }
  }

  /* ───── build ───── */
  @override
  Widget build(BuildContext context) {
    final isEdit  = widget.cleanup != null;
    final isOwner = isEdit && widget.cleanup!.createdById == _myUserId;
    final amIVol  = !isOwner && _volunteers.any((v) => v.id == _myUserId);

    return Scaffold(
      appBar: AppBar(
        title: Text(isEdit
            ? (isOwner ? 'Edit Cleanup Request' : 'View Cleanup Request')
            : 'New Cleanup Request'),
        backgroundColor: Colors.green[700],
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              _buildField(_titleCtl, 'Title', 'Enter cleanup title',
                  enabled: !isEdit || isOwner),
              const SizedBox(height: 16),
              _buildField(_descCtl, 'Description', 'Describe the waste...',
                  lines: 3, enabled: !isEdit || isOwner),
              const SizedBox(height: 16),

              Text('Select Location on Map',
                  style: Theme.of(context).textTheme.titleMedium),
              const SizedBox(height: 8),
              _disabledWrap(
                !isEdit || isOwner,
                LocationPicker(
                  initial: _pickedLoc,
                  onPicked: (pos, info) {
                    _pickedLoc = pos;
                    _accuracy = info['accuracy'] as double?;
                    _addressCtl.text =
                        info['street'] ?? info['district'] ?? '';
                    setState(() {});
                  },
                ),
              ),
              const SizedBox(height: 8),

              if (_pickedLoc != null) ...[
                Text(
                  "Lat: ${_pickedLoc!.latitude.toStringAsFixed(5)}, "
                  "Lng: ${_pickedLoc!.longitude.toStringAsFixed(5)}\n"
                  "Accuracy: ${_accuracy?.toStringAsFixed(1) ?? '?'} m",
                  style: TextStyle(color: Colors.grey[700]),
                ),
                const SizedBox(height: 8),
              ],

              Text(
                _addressCtl.text.isEmpty
                    ? 'Tap the map or use GPS to pick address'
                    : 'Address: ${_addressCtl.text}',
                style: TextStyle(
                  color: _addressCtl.text.isEmpty
                      ? Colors.grey
                      : Colors.green[800],
                  fontWeight: _addressCtl.text.isEmpty
                      ? FontWeight.normal
                      : FontWeight.bold,
                ),
              ),
              const SizedBox(height: 16),

              _buildField(_addressCtl, 'Location Details', 'Add more details…',
                  enabled: !isEdit || isOwner),
              const SizedBox(height: 20),

              Text('Waste Type', style: Theme.of(context).textTheme.titleMedium),
              const SizedBox(height: 8),
              _disabledWrap(
                !isEdit || isOwner,
                WasteTypeSelector(
                  current: _wasteType,
                  onChanged: (v) => setState(() => _wasteType = v),
                ),
              ),
              const SizedBox(height: 20),

              Text('Severity Level',
                  style: Theme.of(context).textTheme.titleMedium),
              const SizedBox(height: 8),
              _disabledWrap(
                !isEdit || isOwner,
                SeveritySelector(
                  current: _severity,
                  onChanged: (v) => setState(() => _severity = v),
                ),
              ),
              const SizedBox(height: 20),

              OutlinedButton.icon(
                onPressed: (!isEdit || isOwner)
                    ? () async {
                        final d = await showDatePicker(
                          context: context,
                          initialDate:
                              _date ?? DateTime.now().add(const Duration(days: 1)),
                          firstDate: DateTime.now(),
                          lastDate:
                              DateTime.now().add(const Duration(days: 365)),
                        );
                        if (d != null) setState(() => _date = d);
                      }
                    : null,
                icon: const Icon(Icons.calendar_today, color: Colors.green),
                label: Text(
                  _date == null
                      ? 'Schedule Cleanup (Optional)'
                      : 'Scheduled for ${_date!.toLocal()}'.split(' ')[0],
                ),
              ),
              const SizedBox(height: 20),

              Text('Upload Photos (Required)',
                  style: Theme.of(context).textTheme.titleMedium),
              const SizedBox(height: 8),
              _disabledWrap(
                !isEdit || isOwner,
                ImagePickerGrid(
                  initial: _images,
                  onChanged: (imgs) => _images = imgs,
                ),
              ),
              const SizedBox(height: 24),

              if (isEdit) ...[
                Text('Volunteers:',
                    style: Theme.of(context).textTheme.titleMedium),
                ..._volunteers.map(
                  (v) => ListTile(
                    leading: CircleAvatar(
                      backgroundImage: v.avatarUrl != null
                          ? NetworkImage(v.avatarUrl!)
                          : null,
                      child: v.avatarUrl == null ? Text(v.fullName[0]) : null,
                    ),
                    title: Text(v.fullName),
                  ),
                ),
                const SizedBox(height: 12),
                ElevatedButton(
                  onPressed: _loading || isOwner ? null : _toggleVolunteer,
                  child: Text(amIVol ? 'Leave Cleanup' : 'Volunteer'),
                ),
                const SizedBox(height: 24),
              ],

              // ← New: only owner sees this when editing
              if (isEdit && isOwner) ...[
                ElevatedButton(
                  onPressed: _loading ? null : _complete,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.orange,
                  ),
                  child: _loading
                      ? const CircularProgressIndicator()
                      : const Text('Mark as Completed'),
                ),
                const SizedBox(height: 24),
              ],

              if (!isEdit || isOwner)
                ElevatedButton(
                  onPressed: _loading ? null : _submit,
                  child: _loading
                      ? const CircularProgressIndicator()
                      : Text(isEdit ? 'UPDATE REQUEST' : 'SUBMIT REQUEST'),
                ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildField(
    TextEditingController ctl,
    String label,
    String hint, {
    int lines = 1,
    bool enabled = true,
  }) {
    return TextFormField(
      controller: ctl,
      maxLines: lines,
      enabled: enabled,
      decoration: InputDecoration(
        labelText: label,
        hintText: hint,
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
      ),
      validator: (v) => v == null || v.isEmpty ? 'Required' : null,
    );
  }
}
