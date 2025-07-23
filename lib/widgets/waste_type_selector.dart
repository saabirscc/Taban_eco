import 'package:flutter/material.dart';

class WasteTypeSelector extends StatelessWidget {
  const WasteTypeSelector({
    super.key,
    required this.current,
    required this.onChanged,
  });

  final String current;
  final ValueChanged<String> onChanged;

  static const _types = [
    {'value': 'plastic',   'label': 'Plastic',   'icon': Icons.local_drink, 'color': Colors.blue},
    {'value': 'organic',   'label': 'Organic',   'icon': Icons.eco,         'color': Colors.green},
    {'value': 'hazardous', 'label': 'Hazardous', 'icon': Icons.warning,     'color': Colors.red},
    {'value': 'general',   'label': 'General',   'icon': Icons.delete,      'color': Colors.grey},
  ];

  @override
  Widget build(BuildContext ctx) => Wrap(
        spacing: 8,
        runSpacing: 8,
        children: _types.map((t) {
          final selected = current == t['value'];
          return ChoiceChip(
            label: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(t['icon'] as IconData,
                    size: 18, color: t['color'] as Color),
                const SizedBox(width: 6),
                Text(t['label'] as String),
              ],
            ),
            selected: selected,
            onSelected: (_) => onChanged(t['value'] as String),
            backgroundColor: Colors.grey[200],
            selectedColor: (t['color'] as Color).withOpacity(0.2),
            labelStyle: TextStyle(
              color: selected ? t['color'] as Color : Colors.black,
              fontWeight: selected ? FontWeight.bold : FontWeight.normal,
            ),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(8),
              side: BorderSide(
                color: selected ? t['color'] as Color : Colors.grey[300]!,
              ),
            ),
          );
        }).toList(),
      );
}
