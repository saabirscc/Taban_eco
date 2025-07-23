import 'dart:io';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';

class ImagePickerGrid extends StatefulWidget {
  const ImagePickerGrid({
    super.key,
    required this.onChanged,
    this.initial = const [],
  });

  final ValueChanged<List<XFile>> onChanged;
  final List<XFile> initial;

  @override
  State<ImagePickerGrid> createState() => _ImagePickerGridState();
}

class _ImagePickerGridState extends State<ImagePickerGrid> {
  final _picker = ImagePicker();
  late List<XFile> _images;

  @override
  void initState() {
    super.initState();
    _images = [...widget.initial];
  }

  Future<void> _add() async {
    final files = await _picker.pickMultiImage(
      maxWidth: 1200,
      maxHeight: 1200,
      imageQuality: 85,
    );
    if (files.isNotEmpty) {
      setState(() => _images.addAll(files));
      widget.onChanged(_images);
    }
  }

  void _remove(XFile f) {
    setState(() => _images.remove(f));
    widget.onChanged(_images);
  }

  @override
  Widget build(BuildContext ctx) {
    if (_images.isEmpty) {
      return GestureDetector(
        onTap: _add,
        child: Container(
          height: 150,
          decoration: BoxDecoration(
            border: Border.all(color: Colors.green, width: 2),
            borderRadius: BorderRadius.circular(12),
          ),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(Icons.cloud_upload, size: 40, color: Colors.green[700]),
              const SizedBox(height: 8),
              Text('Tap to add photos',
                  style: TextStyle(color: Colors.green[700])),
            ],
          ),
        ),
      );
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Wrap(
          spacing: 8,
          runSpacing: 8,
          children: _images
              .map((img) => Stack(children: [
                    ClipRRect(
                      borderRadius: BorderRadius.circular(8),
                      child: Image.file(
                        File(img.path),
                        width: 100,
                        height: 100,
                        fit: BoxFit.cover,
                      ),
                    ),
                    Positioned(
                      top: 4,
                      right: 4,
                      child: GestureDetector(
                        onTap: () => _remove(img),
                        child: const CircleAvatar(
                          radius: 10,
                          backgroundColor: Colors.black54,
                          child: Icon(Icons.close, size: 14, color: Colors.white),
                        ),
                      ),
                    ),
                  ]))
              .toList(),
        ),
        const SizedBox(height: 8),
        TextButton.icon(
          onPressed: _add,
          icon: Icon(Icons.add, color: Colors.green[700]),
          label:
              Text('Add More Photos', style: TextStyle(color: Colors.green[700])),
        ),
      ],
    );
  }
}
