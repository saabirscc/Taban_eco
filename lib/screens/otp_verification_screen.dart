import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:fluttertoast/fluttertoast.dart';

/// Reusable OTP verification screen.
///
/// Pass:
/// - [email]               : shown to the user
/// - [otpLength]           : digits expected (default 6)
/// - [onVerify]            : async callback when user submits code
/// - [onResend] (optional) : async callback to resend code
///
/// It:
/// - Auto focuses first box (if [autoFocus] true)
/// - Moves focus forward/backward automatically
/// - Auto-submits when all boxes filled
/// - Shows a resend cooldown timer
class OtpVerificationScreen extends StatefulWidget {
  final String email;
  final Future<void> Function(String otp) onVerify;
  final Future<void> Function()? onResend;

  final String title;
  final String description;
  final Color mainColor;
  final bool autoFocus;
  final int otpLength;

  const OtpVerificationScreen({
    Key? key,
    required this.email,
    required this.onVerify,
    this.onResend,
    this.title = 'Verification',
    this.description = 'Enter the code sent to your email for verification.',
    this.mainColor = const Color(0xFF3CAC44),
    this.autoFocus = true,
    this.otpLength = 6,
  }) : super(key: key);

  @override
  State<OtpVerificationScreen> createState() => _OtpVerificationScreenState();
}

class _OtpVerificationScreenState extends State<OtpVerificationScreen> {
  final _formKey = GlobalKey<FormState>();
  late final List<TextEditingController> _controllers;
  late final List<FocusNode> _focusNodes;

  bool _isLoading = false;
  Timer? _resendTimer;
  int _resendSecondsLeft = 0;
  static const int _resendCooldown = 30; // seconds

  @override
  void initState() {
    super.initState();
    _controllers = List.generate(widget.otpLength, (_) => TextEditingController());
    _focusNodes  = List.generate(widget.otpLength, (_) => FocusNode());

    if (widget.autoFocus && widget.otpLength > 0) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        _focusNodes.first.requestFocus();
      });
    }
  }

  @override
  void dispose() {
    for (final c in _controllers) { c.dispose(); }
    for (final f in _focusNodes)   { f.dispose(); }
    _resendTimer?.cancel();
    super.dispose();
  }

  bool get _isCodeComplete =>
      _controllers.every((c) => c.text.trim().isNotEmpty);

  String get _currentCode =>
      _controllers.map((c) => c.text.trim()).join();

  Future<void> _handleVerify() async {
    if (!_isCodeComplete) return;
    final code = _currentCode;
    setState(() => _isLoading = true);
    try {
      await widget.onVerify(code);
      // Parent should navigate/handle success.
    } catch (e) {
      Fluttertoast.showToast(
        msg: e.toString(),
        toastLength: Toast.LENGTH_LONG,
        backgroundColor: Colors.red,
        textColor: Colors.white,
      );
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  Future<void> _handleResend() async {
    if (widget.onResend == null) return;
    if (_resendSecondsLeft > 0) return;

    setState(() => _isLoading = true);
    try {
      await widget.onResend!();
      Fluttertoast.showToast(
        msg: 'OTP resent to ${widget.email}',
        backgroundColor: widget.mainColor,
        textColor: Colors.white,
      );
      _startResendCooldown();
    } catch (e) {
      Fluttertoast.showToast(
        msg: e.toString(),
        toastLength: Toast.LENGTH_LONG,
        backgroundColor: Colors.red,
        textColor: Colors.white,
      );
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  void _startResendCooldown() {
    _resendSecondsLeft = _resendCooldown;
    _resendTimer?.cancel();
    _resendTimer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (_resendSecondsLeft <= 1) {
        timer.cancel();
        if (mounted) setState(() => _resendSecondsLeft = 0);
      } else {
        if (mounted) setState(() => _resendSecondsLeft -= 1);
      }
    });
  }

  OutlineInputBorder _inputBorder(Color color) => OutlineInputBorder(
        borderRadius: BorderRadius.circular(8),
        borderSide: BorderSide(color: color, width: 2),
      );

  Widget _buildOtpFields() {
    const double boxSize = 50;
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
      children: List.generate(widget.otpLength, (index) {
        return SizedBox(
          width: boxSize,
          height: boxSize,
          child: TextFormField(
            controller: _controllers[index],
            focusNode: _focusNodes[index],
            enabled: !_isLoading,
            textAlign: TextAlign.center,
            style: TextStyle(fontSize: 24, color: widget.mainColor),
            keyboardType: TextInputType.number,
            maxLength: 1,
            inputFormatters: [FilteringTextInputFormatter.digitsOnly],
            decoration: InputDecoration(
              counterText: '',
              enabledBorder: _inputBorder(widget.mainColor),
              focusedBorder: _inputBorder(widget.mainColor),
            ),
            onChanged: (val) {
              if (val.isEmpty) {
                // backspace to previous
                if (index > 0) {
                  _focusNodes[index].unfocus();
                  _focusNodes[index - 1].requestFocus();
                  _controllers[index - 1].selection = TextSelection.collapsed(
                    offset: _controllers[index - 1].text.length,
                  );
                }
              } else {
                // keep only last char
                final filtered = val.characters.last;
                _controllers[index].text = filtered;
                _controllers[index].selection = TextSelection.collapsed(offset: 1);

                if (index < widget.otpLength - 1) {
                  _focusNodes[index].unfocus();
                  _focusNodes[index + 1].requestFocus();
                  _controllers[index + 1].selection = TextSelection.collapsed(
                    offset: _controllers[index + 1].text.length,
                  );
                } else {
                  _focusNodes[index].unfocus();
                }

                // auto submit
                if (_isCodeComplete) {
                  Future.delayed(const Duration(milliseconds: 100), () {
                    if (mounted) _handleVerify();
                  });
                }
              }
              setState(() {});
            },
            textInputAction: index < widget.otpLength - 1
                ? TextInputAction.next
                : TextInputAction.done,
            onTap: () {
              // select all on tap for quick overwrite
              _controllers[index].selection =
                  TextSelection(baseOffset: 0, extentOffset: _controllers[index].text.length);
            },
          ),
        );
      }),
    );
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        iconTheme: IconThemeData(color: theme.colorScheme.onSurface),
        title: Text(
          widget.title,
          style: theme.textTheme.titleLarge?.copyWith(
            color: theme.colorScheme.onSurface,
          ),
        ),
        centerTitle: true,
      ),
      body: GestureDetector(
        onTap: () => FocusScope.of(context).unfocus(),
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              const SizedBox(height: 16),
              Text(
                widget.description,
                style: theme.textTheme.bodyMedium?.copyWith(
                  color: theme.colorScheme.onSurface.withOpacity(.7),
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 12),
              Text(
                'Code sent to ${widget.email}',
                style: theme.textTheme.bodyMedium?.copyWith(
                  fontWeight: FontWeight.bold,
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 24),

              Form(
                key: _formKey,
                child: Column(
                  children: [
                    _buildOtpFields(),
                    const SizedBox(height: 24),
                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton(
                        onPressed: _isCodeComplete && !_isLoading
                            ? _handleVerify
                            : null,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: widget.mainColor,
                          padding: const EdgeInsets.symmetric(vertical: 16),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(8),
                          ),
                        ),
                        child: _isLoading
                            ? const SizedBox(
                                height: 24,
                                width: 24,
                                child: CircularProgressIndicator(
                                  strokeWidth: 2,
                                  color: Colors.white,
                                ),
                              )
                            : const Text('Verify'),
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 24),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    "Didn't get a code? ",
                    style: theme.textTheme.bodyMedium,
                  ),
                  GestureDetector(
                    onTap: (_resendSecondsLeft == 0 && !_isLoading)
                        ? _handleResend
                        : null,
                    child: Text(
                      _resendSecondsLeft > 0
                          ? 'Resend in $_resendSecondsLeft s'
                          : 'resend now',
                      style: theme.textTheme.bodyMedium?.copyWith(
                        color: (_resendSecondsLeft == 0 && !_isLoading)
                            ? widget.mainColor
                            : theme.disabledColor,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
