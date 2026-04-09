# PayU - Personal Finance Management App
Click on the image to see demo video
<p align="center">
  <a href="https://youtube.com/shorts/b43_qBcj13o?feature=share">
    <img src="PayU.png" alt="PayU Banner" width="300"/>
  </a>
</p>

## Download on android

 <a href="https://expo.dev/accounts/avishcreates-16/projects/payu/builds/c7a40034-c93d-4ee2-bd0a-36eb3d9e1bb0">
 PayU
  </a>
  
## Overview

PayU is a comprehensive personal finance management mobile application built with React Native and Expo. It provides users with tools to track expenses, manage multiple currencies, monitor credit scores, and gain insights into their financial health.

## Technology Stack

### Core Technologies
- **React Native** (0.81.5) - Cross-platform mobile development
- **Expo** (~54.0.33) - Development platform and toolchain
- **TypeScript** (~5.9.2) - Type-safe JavaScript
- **React Navigation** (v7) - Navigation and routing

### Key Dependencies
- **expo-secure-store** (~15.0.8) - Secure local storage
- **expo-linear-gradient** (^55.0.11) - Gradient backgrounds
- **lucide-react-native** (^1.7.0) - Icon library
- **@react-navigation/bottom-tabs** (^7.15.9) - Bottom tab navigation
- **@react-navigation/native-stack** (^7.14.10) - Stack navigation

## Project Structure

```
payu/
├── src/
│   ├── auth/                    # Authentication screens
│   │   ├── authentication.tsx   # Auth container with sign-in/sign-up toggle
│   │   ├── Signin.tsx          # Sign-in form
│   │   └── Signup.tsx          # Sign-up form (also used for profile editing)
│   ├── payu/                   # Main app screens
│   │   ├── home.tsx            # Home dashboard with expense tracking
│   │   ├── Balance.tsx         # Balance and credit score view
│   │   ├── profile.tsx         # User profile management
│   │   ├── TabNavigator.tsx    # Bottom tab navigation
│   │   └── components/         # Reusable UI components
│   │       ├── AddTranactionModal.tsx  # Add transaction modal
│   │       ├── BankCard.tsx              # Bank card display
│   │       ├── ExpenseCard.tsx           # Expense item card
│   │       ├── GradientBarGraph.tsx      # Financial charts
│   │       ├── Header.tsx                # Screen header
│   │       ├── Preview.tsx               # Profile preview
│   │       └── Semicircle.tsx            # Credit score visualization
│   └── styles/                 # Global styles and components
├── localstorage-services/      # Data management layer
│   ├── auth.tsx               # User authentication storage
│   ├── finances.tsx           # Financial data management
│   └── transactions.tsx       # Transaction handling
└── assets/                    # App assets and images
```

## Core Features

### 1. User Authentication
- **Sign Up**: Create new accounts with email and password
- **Sign In**: Secure login with password visibility toggle
- **Profile Management**: Edit user information and account settings
- **Secure Storage**: Uses expo-secure-store for persistent authentication

### 2. Financial Dashboard (Home Screen)
- **Welcome Interface**: Personalized greeting with user name
- **Bank Card Display**: Visual representation of user's financial profile
- **Expense Tracking**: 
  - Weekly and monthly expense views
  - Categorized transactions (food, transport, shopping, etc.)
  - Add new expenses via floating action button
- **Financial Setup**: Initial configuration for new users including:
  - Currency selection (USD, CAD, INR)
  - Net worth entry
  - Monthly income and expenses
  - Bank information

### 3. Balance & Credit Management
- **Credit Score Visualization**: Semi-circular progress chart showing credit score ranges
- **Multi-Currency Support**: View and manage different currency accounts
- **Financial Timeline**: Bar charts showing spending patterns over time
- **Margin Tracking**: Monitor spending against budgets

### 4. Profile Management
- **User Information**: View and edit personal details
- **Financial Profile**: Access to financial setup and preferences
- **Account Actions**: 
  - Logout functionality
  - Account deletion option
- **Toggle Interface**: Switch between preview and edit modes

## Data Management

### Authentication Service (`localstorage-services/auth.tsx`)
- **Secure Storage**: Uses expo-secure-store with in-memory fallback
- **User Management**: CRUD operations for user accounts
- **Session Management**: Current user tracking and token storage
- **Security**: Password handling and account deletion

### Financial Services (`localstorage-services/finances.tsx`)
- **Currency Support**: USD, CAD, INR with exchange rate handling
- **Transaction Categories**: 
  - Income: salary, freelance, investment, gift
  - Expenses: food, transport, shopping, bills, healthcare, entertainment, other
- **Financial Profile**: Net worth, income, expenses tracking
- **Credit Score**: Calculation and historical tracking
- **Data Persistence**: Secure local storage with fallback

### Transaction Service (`localstorage-services/transactions.tsx`)
- **Transaction Management**: Add, edit, delete transactions
- **Categorization**: Automatic and manual categorization
- **Timeline Data**: 5-day financial projections
- **Reporting**: Expense analysis and insights

## User Interface Design

### Design System
- **Color Scheme**: Dark theme with gradient backgrounds
- **Typography**: Clean, readable text with proper hierarchy
- **Components**: Consistent, reusable UI components
- **Responsive Design**: Adaptive layouts for different screen sizes

### Key UI Elements
- **Gradient Backgrounds**: Modern visual appeal
- **Card-Based Layout**: Information organized in cards
- **Toggle Switches**: Smooth transitions between views
- **Modal Dialogs**: Focused interactions for data entry
- **Floating Action Buttons**: Quick access to common actions

## Navigation Structure

### Authentication Flow
1. **Authentication Screen**: Toggle between Sign In and Sign Up
2. **Main App**: Bottom tab navigation after successful login

### Main App Navigation
- **Home Tab**: Financial dashboard and expense tracking
- **Balance Tab**: Credit score and currency management
- **Profile Tab**: User settings and account management

## Security Features

### Data Protection
- **Secure Storage**: Sensitive data encrypted using expo-secure-store
- **Local Storage**: No external API dependencies for sensitive data
- **Session Management**: Secure token handling
- **Input Validation**: Client-side validation for all user inputs

### Privacy Considerations
- **Offline-First**: All data stored locally on device
- **No Data Transmission**: Financial data never leaves the device
- **User Control**: Complete control over data deletion

## Development Setup

### Prerequisites
- Node.js (v16 or higher)
- Expo CLI
- React Native development environment

### Installation
```bash
#Download
git clone https://github.com/avserver-16/PayU
cd payu
npm install
```

### Running the App
```bash


# Start development server
npm start

#ExpoGo
npx expo start --clear   (scan the qr and have expo go app downloaded)

# Run on specific platforms
npm run android
npm run ios
npm run web
```

## Configuration

### App Configuration (`app.json`)
- **App Name**: PayU
- **Bundle ID**: com.avserver16.payu
- **Platforms**: iOS, Android, Web
- **Orientation**: Portrait only
- **Plugins**: expo-secure-store for secure storage

### TypeScript Configuration
- Strict type checking enabled
- Proper module resolution
- React Native type definitions

## What You Can Do With PayU

### For Individual Users
1. **Track Daily Expenses**: Log and categorize all spending
2. **Monitor Financial Health**: View net worth and credit score
3. **Set Financial Goals**: Track progress towards financial objectives
4. **Manage Multiple Currencies**: Handle international finances
5. **Analyze Spending Patterns**: Get insights into financial habits

### For Financial Planning
1. **Budget Management**: Set and track monthly budgets
2. **Expense Categorization**: Understand where money goes
3. **Income Tracking**: Monitor all sources of income
4. **Financial Projections**: Plan for future expenses
5. **Credit Score Monitoring**: Track and improve credit health

### Data Management
1. **Secure Storage**: All financial data securely stored locally
2. **Transaction History**: Complete record of all financial activities
3. **Export Data**: Ability to export financial data (potential feature)
4. **Backup Options**: Local backup and restore capabilities

## Future Enhancements

### Potential Features
- **Cloud Sync**: Optional cloud synchronization
- **Advanced Analytics**: More sophisticated financial insights
- **Bill Reminders**: Automated bill payment reminders
- **Investment Tracking**: Portfolio management features
- **Goal Setting**: Financial goal tracking and milestones
- **Reports Generation**: Detailed financial reports
- **Multi-User Support**: Family or shared account management

### Technical Improvements
- **Performance Optimization**: Enhanced app performance
- **Offline Enhancements**: Better offline functionality
- **Biometric Authentication**: Fingerprint/Face ID support
- **Widgets**: Home screen widgets for quick access
- **Notifications**: Push notifications for important updates

## Conclusion

PayU is a comprehensive personal finance management application that provides users with powerful tools to track, analyze, and improve their financial health. With its secure local storage, intuitive interface, and comprehensive feature set, it serves as an excellent foundation for personal financial management on mobile devices.

The application demonstrates best practices in React Native development, including proper state management, secure data handling, and responsive design. Its modular architecture makes it easy to extend and customize for specific financial management needs.
