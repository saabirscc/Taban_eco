import 'package:flutter/material.dart';

class SeveritySelector extends StatelessWidget {
  const SeveritySelector({
    super.key,
    required this.current,
    required this.onChanged,
  });

  final String current;
  final ValueChanged<String> onChanged;

  static const _levels = [
    {'value': 'low',      'label': 'Low',      'emoji': '🟢', 'color': Colors.green},
    {'value': 'moderate', 'label': 'Moderate', 'emoji': '🟡', 'color': Colors.orange},
    {'value': 'high',     'label': 'High',     'emoji': '🔴', 'color': Colors.red},
  ];

  @override
  Widget build(BuildContext ctx) => SegmentedButton<String>(
        segments: _levels
            .map((l) => ButtonSegment<String>(
                  value: l['value'] as String,
                  label: Text('${l['emoji']} ${l['label']}'),
                ))
            .toList(),
        selected: {current},
        onSelectionChanged: (s) => onChanged(s.first),
        style: ButtonStyle(
          backgroundColor: WidgetStateProperty.resolveWith<Color?>(
            (states) => states.contains(WidgetState.selected)
                ? (_levels.firstWhere((e) => e['value'] == current)['color']
                        as Color)
                    .withOpacity(0.1)
                : null,
          ),
        ),
      );
}
