import 'package:flutter/material.dart';

class InputField extends StatelessWidget {
  final String label;
  final bool obscure;
  final Function(String) onChanged;
  final TextInputType keyboardType;

  const InputField({
    super.key,
    required this.label,
    this.obscure = false,
    required this.onChanged,
    this.keyboardType = TextInputType.text,
  });

  @override
  Widget build(BuildContext context) {
    return TextFormField(
      decoration: InputDecoration(labelText: label),
      obscureText: obscure,
      keyboardType: keyboardType,
      validator: (value) => value == null || value.isEmpty ? 'Required' : null,
      onChanged: onChanged,
    );
  }
}
