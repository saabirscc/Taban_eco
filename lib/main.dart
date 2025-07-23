// import 'package:flutter/material.dart';
// import 'package:provider/provider.dart';
// import 'package:vol/providers/auth_provider.dart';
// import 'package:vol/router.dart';

// void main() {
//   WidgetsFlutterBinding.ensureInitialized();
//   runApp(const EcoVolunteerApp());
// }

// class EcoVolunteerApp extends StatefulWidget {
//   const EcoVolunteerApp({Key? key}) : super(key: key);

//   @override
//   State<EcoVolunteerApp> createState() => _EcoVolunteerAppState();
// }

// class _EcoVolunteerAppState extends State<EcoVolunteerApp> {
//   late final AuthProvider _authProvider;
//   bool _ready = false;

//   @override
//   void initState() {
//     super.initState();
//     _authProvider = AuthProvider();
//     _bootstrap();
//   }

//   Future<void> _bootstrap() async {
//     await _authProvider.tryAutoLogin();
//     setState(() => _ready = true);
//   }

//   @override
//   Widget build(BuildContext context) {
//     if (!_ready) {
//       return const MaterialApp(
//         debugShowCheckedModeBanner: false,
//         home: Scaffold(
//           body: Center(child: CircularProgressIndicator()),
//         ),
//       );
//     }

//     return ChangeNotifierProvider.value(
//       value: _authProvider,
//       child: MaterialApp.router(
//         title: 'Eco Volunteer',
//         debugShowCheckedModeBanner: false,
//         routerConfig: appRouter,
//         theme: ThemeData.from(
//           colorScheme: ColorScheme.fromSeed(seedColor: Colors.green),
//           useMaterial3: true,
//         ).copyWith(
//           floatingActionButtonTheme: FloatingActionButtonThemeData(
//             backgroundColor: Colors.green.shade700,
//             foregroundColor: Colors.white,
//           ),
//           elevatedButtonTheme: ElevatedButtonThemeData(
//             style: ElevatedButton.styleFrom(
//               backgroundColor: Colors.green.shade700,
//               foregroundColor: Colors.white,
//               shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
//             ),
//           ),
//           snackBarTheme: SnackBarThemeData(
//             backgroundColor: Colors.green.shade700,
//             contentTextStyle: const TextStyle(color: Colors.white),
//           ),
//         ),
//       ),
//     );
//   }
// }











import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:vol/providers/auth_provider.dart';
import 'package:vol/router.dart';
import 'package:vol/screens/login_screen.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const EcoVolunteerApp());
}

class EcoVolunteerApp extends StatefulWidget {
  const EcoVolunteerApp({Key? key}) : super(key: key);

  @override
  State<EcoVolunteerApp> createState() => _EcoVolunteerAppState();
}

class _EcoVolunteerAppState extends State<EcoVolunteerApp> {
  late final AuthProvider _authProvider;
  bool _ready = false;
  bool _showOnboarding = true;

  @override
  void initState() {
    super.initState();
    _authProvider = AuthProvider();
    _bootstrap();
  }

  Future<void> _bootstrap() async {
    await _authProvider.tryAutoLogin();
    setState(() => _ready = true);
  }

  void _completeOnboarding() {
    setState(() {
      _showOnboarding = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    if (!_ready) {
      return const MaterialApp(
        debugShowCheckedModeBanner: false,
        home: Scaffold(
          body: Center(child: CircularProgressIndicator()),
        ),
      );
    }

    if (_showOnboarding) {
      return MaterialApp(
        debugShowCheckedModeBanner: false,
        home: OnboardingScreen(
          onComplete: _completeOnboarding,
        ),
      );
    }

    return ChangeNotifierProvider.value(
      value: _authProvider,
      child: MaterialApp.router(
        title: 'Eco Volunteer',
        debugShowCheckedModeBanner: false,
        routerConfig: appRouter,
        theme: ThemeData.from(
          colorScheme: ColorScheme.fromSeed(seedColor: Colors.green),
          useMaterial3: true,
        ).copyWith(
          floatingActionButtonTheme: FloatingActionButtonThemeData(
            backgroundColor: Colors.green.shade700,
            foregroundColor: Colors.white,
          ),
          elevatedButtonTheme: ElevatedButtonThemeData(
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.green.shade700,
              foregroundColor: Colors.white,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
            ),
          ),
          snackBarTheme: SnackBarThemeData(
            backgroundColor: Colors.green.shade700,
            contentTextStyle: const TextStyle(color: Colors.white),
          ),
        ),
      ),
    );
  }
}

class OnboardingScreen extends StatefulWidget {
  final VoidCallback onComplete;
  
  const OnboardingScreen({super.key, required this.onComplete});

  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen> {
  final PageController _pageController = PageController();
  int _currentPage = 0;

  final List<OnboardingPage> _pages = [
    const OnboardingPage(
      title: "Environmental\nCleanliness",
      subtitle: "",
      imagePath: "assets/images/3.png",
    ),
    const OnboardingPage(
      title: "Revitalize your\nenvironment",
      subtitle: "with our trained team",
      imagePath: "assets/images/2.png",
    ),
    const OnboardingPage(
      title: "Discover the power",
      subtitle: "of eco friendly cleaning",
      imagePath: "assets/images/1.png",
    ),
    const OnboardingPage(
      title: "Join us today",
      subtitle: "and make a difference",
      imagePath: "assets/images/4.png",
    ),
  ];

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Column(
        children: [
          Expanded(
            child: PageView.builder(
              controller: _pageController,
              itemCount: _pages.length,
              onPageChanged: (int page) {
                setState(() {
                  _currentPage = page;
                });
              },
              itemBuilder: (context, index) {
                return AnimatedBuilder(
                  animation: _pageController,
                  builder: (context, child) {
                    double value = 1.0;
                    if (_pageController.position.haveDimensions) {
                      value = _pageController.page! - index;
                      value = (1 - (value.abs() * 0.3)).clamp(0.0, 1.0);
                    }
                    
                    return Transform.scale(
                      scale: Curves.easeOut.transform(value),
                      child: child,
                    );
                  },
                  child: _pages[index],
                );
              },
            ),
          ),
          Padding(
            padding: const EdgeInsets.only(bottom: 45.0, left: 20, right: 20),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                TextButton(
                  onPressed: widget.onComplete,
                  child: const Text(
                    "Skip",
                    style: TextStyle(
                      color: Colors.grey,
                      fontSize: 16,
                    ),
                  ),
                ),
                
                Row(
                  children: List.generate(_pages.length, (index) {
                    return AnimatedContainer(
                      duration: const Duration(milliseconds: 300),
                      margin: const EdgeInsets.symmetric(horizontal: 4),
                      width: _currentPage == index ? 12 : 8,
                      height: 8,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: _currentPage == index 
                            ? Colors.green 
                            : Colors.grey.withOpacity(0.4),
                      ),
                    );
                  }),
                ),
                
                _currentPage == _pages.length - 1
                    ? ElevatedButton(
                        onPressed: widget.onComplete,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.green,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(20),
                          ),
                          padding: const EdgeInsets.symmetric(
                              horizontal: 24, vertical: 12),
                        ),
                        child: const Text(
                          "Get Started",
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 16,
                          ),
                        ),
                      )
                    : IconButton(
                        onPressed: () {
                          _pageController.nextPage(
                            duration: const Duration(milliseconds: 500),
                            curve: Curves.easeInOut,
                          );
                        },
                        icon: const Icon(
                          Icons.arrow_forward,
                          color: Colors.green,
                          size: 30,
                        ),
                      ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class OnboardingPage extends StatelessWidget {
  final String title;
  final String subtitle;
  final String imagePath;

  const OnboardingPage({
    super.key,
    required this.title,
    required this.subtitle,
    required this.imagePath,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 30),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          // Animated image with appropriate size
          Hero(
            tag: imagePath,
            child: Image.asset(
              imagePath,
              height: 200, // Reduced from 250 to 200
              fit: BoxFit.contain,
            ),
          ),
          const SizedBox(height: 30),
          Text(
            title,
            style: const TextStyle(
              fontSize: 26, // Slightly reduced from 28
              fontWeight: FontWeight.bold,
              color: Colors.green,
              height: 1.2,
            ),
            textAlign: TextAlign.center,
          ),
          if (subtitle.isNotEmpty) const SizedBox(height: 8),
          if (subtitle.isNotEmpty)
            Text(
              subtitle,
              style: TextStyle(
                fontSize: 18, // Reduced from 20
                fontWeight: FontWeight.w500,
                color: Colors.grey[800],
                height: 1.3,
              ),
              textAlign: TextAlign.center,
            ),
        ],
      ),
    );
  }
}