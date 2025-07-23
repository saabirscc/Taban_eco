//Welcome Screen
//672B2B
import 'package:flutter/material.dart';

class WelcomeScreen extends StatefulWidget {
  const WelcomeScreen({super.key});

  @override
  State<WelcomeScreen> createState() => _WelcomeScreenState();
}

class _WelcomeScreenState extends State<WelcomeScreen>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _fadeAnimation;
  late Animation<double> _scaleAnimation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: const Duration(milliseconds: 1000),
      vsync: this,
    );

    _fadeAnimation = Tween<double>(begin: 0, end: 1).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeIn),
    );

    _scaleAnimation = Tween<double>(begin: 0.95, end: 1).animate(
      CurvedAnimation(parent: _controller, curve: Curves.fastOutSlowIn),
    );

    _controller.forward();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[50],
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 20),
            Row(
              children: [
                Icon(Icons.eco, size: 40, color: Colors.green[700]),
                const SizedBox(width: 12),
                Text(
                  'Eco Volunteer',
                  style: TextStyle(
                    fontSize: 28,
                    fontWeight: FontWeight.bold,
                    color: Colors.green[700],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 30),
            // Redesigned Our Mission Section
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: Colors.green[50],
                borderRadius: BorderRadius.circular(16),
                border: Border.all(
                  color: Colors.green[100]!,
                  width: 2,
                ),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(
                          color: Colors.green[700],
                          shape: BoxShape.circle,
                        ),
                        child: const Icon(
                          Icons.cleaning_services,
                          color: Colors.white,
                          size: 28,
                        ),
                      ),
                      const SizedBox(width: 12),
                      Text(
                        'Our Mission',
                        style: TextStyle(
                          fontSize: 22,
                          fontWeight: FontWeight.bold,
                          color: Colors.green[800],
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  Text(
                    'Empower communities to maintain a clean and healthy environment through collaborative clean-up efforts. Join us in making a positive impact by reporting waste and participating in community cleanups.',
                    style: TextStyle(
                      fontSize: 16,
                      color: Colors.grey[800],
                      height: 1.6,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 25),
            Text(
              'Key Features',
              style: TextStyle(
                fontWeight: FontWeight.w600,
                fontSize: 22,
                color: Colors.green[800],
              ),
            ),
            const SizedBox(height: 15),
            _AnimatedFeatureItem(
              animation: _controller,
              delay: 0,
              icon: Icons.report,
              title: 'Report Waste',
              subtitle: 'Easily report waste in your area',
            ),
            _AnimatedFeatureItem(
              animation: _controller,
              delay: 100,
              icon: Icons.event,
              title: 'Schedule Cleanups',
              subtitle: 'Organize and join community cleanups',
            ),
            _AnimatedFeatureItem(
              animation: _controller,
              delay: 200,
              icon: Icons.leaderboard,
              title: 'Track Impact',
              subtitle: 'See your environmental contribution',
            ),
            _AnimatedFeatureItem(
              animation: _controller,
              delay: 300,
              icon: Icons.language,
              title: 'Multilingual',
              subtitle: 'Accessible in multiple languages',
            ),
            _AnimatedFeatureItem(
              animation: _controller,
              delay: 400,
              icon: Icons.map,
              title: 'Interactive Map',
              subtitle: 'View cleanups on a map',
            ),
            _AnimatedFeatureItem(
              animation: _controller,
              delay: 500,
              icon: Icons.support,
              title: 'Support',
              subtitle: 'Get help and provide feedback',
            ),
            const SizedBox(height: 30),
            Center(
              child: ElevatedButton(
                onPressed: () {},
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.green[700],
                  padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 16),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(30),
                  ),
                ),
                child: const Text(
                  'Get Started',
                  style: TextStyle(fontSize: 18, color: Colors.white),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _AnimatedFeatureItem extends StatelessWidget {
  final Animation<double> animation;
  final int delay;
  final IconData icon;
  final String title;
  final String subtitle;

  const _AnimatedFeatureItem({
    required this.animation,
    required this.delay,
    required this.icon,
    required this.title,
    required this.subtitle,
  });

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: animation,
      builder: (context, child) {
        return FadeTransition(
          opacity: animation,
          child: Transform.translate(
            offset: Offset(0, 20 * (1 - animation.value)),
            child: child,
          ),
        );
      },
      child: Padding(
        padding: const EdgeInsets.only(bottom: 12),
        child: Container(
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(12),
            boxShadow: [
              BoxShadow(
                color: Colors.grey.withOpacity(0.1),
                spreadRadius: 2,
                blurRadius: 8,
                offset: const Offset(0, 2),
              ),
            ],
          ),
          child: ListTile(
            leading: Icon(icon, color: Colors.green[700]),
            title: Text(title, style: const TextStyle(fontWeight: FontWeight.w500)),
            subtitle: Text(subtitle, style: TextStyle(color: Colors.grey[600])),
            contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
            ),
          ),
        ),
      ),
    );
  }
}