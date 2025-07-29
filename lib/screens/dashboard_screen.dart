// // lib/screens/dashboard_screen.dart

// import 'package:flutter/material.dart';
// import 'package:provider/provider.dart';
// import 'package:flutter_animate/flutter_animate.dart';

// import '../providers/auth_provider.dart';
// import '../widgets/app_drawer.dart';
// import '../widgets/cleanups_tabview.dart';
// import '../widgets/profile_tab.dart';
// import '../widgets/dashboard_home.dart';
// import 'login_screen.dart';
// import 'feedback_screen.dart';
// import 'welcome_screen.dart';
// import 'map_screen.dart';
// import 'contact_screen.dart';
// import 'rewards_screen.dart';

// class DashboardScreen extends StatefulWidget {
//   const DashboardScreen({super.key});

//   @override
//   State<DashboardScreen> createState() => _DashboardScreenState();
// }

// class _DashboardScreenState extends State<DashboardScreen>
//     with SingleTickerProviderStateMixin {
//   int _bottomIndex = 0;
//   int? _drawerIndex;

//   late final AnimationController _animationController;
//   late final Animation<double> _fadeAnimation;
//   late final Animation<double> _scaleAnimation;

//   @override
//   void initState() {
//     super.initState();
//     _animationController = AnimationController(
//       vsync: this,
//       duration: 500.ms,
//     );
//     _fadeAnimation = Tween<double>(begin: 0, end: 1).animate(
//       CurvedAnimation(parent: _animationController, curve: Curves.easeInOut),
//     );
//     _scaleAnimation = Tween<double>(begin: 0.95, end: 1).animate(
//       CurvedAnimation(parent: _animationController, curve: Curves.easeOutBack),
//     );
//     _animationController.forward();
//   }

//   @override
//   void dispose() {
//     _animationController.dispose();
//     super.dispose();
//   }

//   // ───────── Drawer vs Bottom navigation ─────────
//   void _setBottom(int i) => setState(() {
//         _bottomIndex = i;
//         _drawerIndex = null;
//         _animationController
//           ..reset()
//           ..forward();
//       });

//   void _setDrawer(int? i) => setState(() {
//         _drawerIndex = i;
//         _animationController
//           ..reset()
//           ..forward();
//       });

//   // ───────── Which screen to show ─────────
//   Widget _buildBody() {
//     if (_drawerIndex != null) {
//       switch (_drawerIndex) {
//         case 0:
//           return const DashboardHome();
//         case 1:
//           return const WelcomeScreen();
//         case 2:
//           return const CleanupsTabView();
//         case 3:
//           return const MapScreen();
//         case 4:
//           return const FeedbackScreen();
//         case 5:
//           return const ContactScreen();
//         default:
//           return const SizedBox.shrink();
//       }
//     }

//     // bottom-bar routes
//     switch (_bottomIndex) {
//       case 0:
//         return const DashboardHome();
//       case 1:
//         return const CleanupsTabView();
//       case 2:
//         return const RewardsScreen();
//       case 3:
//         return const ProfileTab();
//       case 4:
//         return const FeedbackScreen();
//       default:
//         return const SizedBox.shrink();
//     }
//   }

//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       appBar: AppBar(
//         title: const Text('Eco Volunteer'),
//         centerTitle: true,
//         backgroundColor: Colors.green.shade700,
//       ),
//       drawer: AppDrawer(onSelect: _setDrawer),
//       body: FadeTransition(
//         opacity: _fadeAnimation,
//         child: ScaleTransition(
//           scale: _scaleAnimation,
//           child: _buildBody(),
//         ),
//       ),
//       bottomNavigationBar: BottomNavigationBar(
//         currentIndex: _bottomIndex,
//         onTap: _setBottom,
//         selectedItemColor: Colors.green.shade700,
//         unselectedItemColor: Colors.grey,
//         type: BottomNavigationBarType.fixed,
//         items: const [
//           BottomNavigationBarItem(
//             icon: Icon(Icons.dashboard),
//             label: 'Dashboard',
//           ),
//           BottomNavigationBarItem(
//             icon: Icon(Icons.cleaning_services),
//             label: 'Cleanups',
//           ),
//           BottomNavigationBarItem(
//             icon: Icon(Icons.emoji_events),
//             label: 'Rewards',
//           ),
//           BottomNavigationBarItem(
//             icon: Icon(Icons.person),
//             label: 'Profile',
//           ),
//           BottomNavigationBarItem(
//             icon: Icon(Icons.feedback),
//             label: 'Feedback',
//           ),
//         ],
//       ).animate().fadeIn(delay: 200.ms),
//     );
//   }
// }




//sabirin updated the code
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:flutter_animate/flutter_animate.dart';

import '../providers/auth_provider.dart';
import '../widgets/app_drawer.dart';
import '../widgets/cleanups_tabview.dart';
import '../widgets/profile_tab.dart';
import '../widgets/dashboard_home.dart';
import 'login_screen.dart';
import 'feedback_screen.dart';
import 'welcome_screen.dart';
import 'map_screen.dart';
import 'contact_screen.dart';
import 'rewards_screen.dart';
import 'stories_screen.dart';  // Import the new Stories screen

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen>
    with SingleTickerProviderStateMixin {
  int _bottomIndex = 0;
  int? _drawerIndex;

  late final AnimationController _animationController;
  late final Animation<double> _fadeAnimation;
  late final Animation<double> _scaleAnimation;

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      vsync: this,
      duration: 500.ms,
    );
    _fadeAnimation = Tween<double>(begin: 0, end: 1).animate(
      CurvedAnimation(parent: _animationController, curve: Curves.easeInOut),
    );
    _scaleAnimation = Tween<double>(begin: 0.95, end: 1).animate(
      CurvedAnimation(parent: _animationController, curve: Curves.easeOutBack),
    );
    _animationController.forward();
  }

  @override
  void dispose() {
    _animationController.dispose();
    super.dispose();
  }

  // ───────── Drawer vs Bottom navigation ─────────
  void _setBottom(int i) => setState(() {
        _bottomIndex = i;
        _drawerIndex = null;
        _animationController
          ..reset()
          ..forward();
      });

  void _setDrawer(int? i) => setState(() {
        _drawerIndex = i;
        _animationController
          ..reset()
          ..forward();
      });

  // ───────── Which screen to show ─────────
  Widget _buildBody() {
    if (_drawerIndex != null) {
      switch (_drawerIndex) {
        case 0:
          return const DashboardHome();
        case 1:
          return const WelcomeScreen();
        case 2:
          return const CleanupsTabView();
        case 3:
          return const MapScreen();
        case 4:
          return const FeedbackScreen();
        case 5:
          return const ContactScreen();
        default:
          return const SizedBox.shrink();
      }
    }

    // bottom-bar routes
    switch (_bottomIndex) {
      case 0:
        return const DashboardHome();
      case 1:
        return const CleanupsTabView();
      case 2:
        return const RewardsScreen();
      case 3:
        return const ProfileTab();
      case 4:
        return const FeedbackScreen();
      case 5:
        return const StoriesScreen(); // Add this line for the Stories tab
      default:
        return const SizedBox.shrink();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Eco Volunteer'),
        centerTitle: true,
        backgroundColor: Colors.green.shade700,
      ),
      drawer: AppDrawer(onSelect: _setDrawer),
      body: FadeTransition(
        opacity: _fadeAnimation,
        child: ScaleTransition(
          scale: _scaleAnimation,
          child: _buildBody(),
        ),
      ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _bottomIndex,
        onTap: _setBottom,
        selectedItemColor: Colors.green.shade700,
        unselectedItemColor: Colors.grey,
        type: BottomNavigationBarType.fixed,
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.dashboard),
            label: 'Dashboard',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.cleaning_services),
            label: 'Cleanups',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.emoji_events),
            label: 'Rewards',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.person),
            label: 'Profile',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.feedback),
            label: 'Feedback',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.book),
            label: 'Stories', // Add this tab
          ),
        ],
      ).animate().fadeIn(delay: 200.ms),
    );
  }
}
