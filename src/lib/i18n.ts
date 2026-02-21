import { Language, useLanguageStore } from '@/store/languageStore';

export interface Translations {
  // Common
  common: {
    welcome: string;
    loading: string;
    save: string;
    cancel: string;
    edit: string;
    delete: string;
    confirm: string;
    search: string;
    filter: string;
    clear: string;
    submit: string;
    close: string;
    back: string;
    next: string;
    previous: string;
    yes: string;
    no: string;
  };

  // Navigation
  nav: {
    dashboard: string;
    vehicles: string;
    trips: string;
    maintenance: string;
    fuel: string;
    drivers: string;
    analytics: string;
    profile: string;
    aiAssistant: string;
    logout: string;
    commandCenter: string;
    fuelExpenses: string;
    financialAnalytics: string;
  };

  // Auth
  auth: {
    login: string;
    register: string;
    email: string;
    password: string;
    confirmPassword: string;
    fullName: string;
    role: string;
    signIn: string;
    signUp: string;
    signingIn: string;
    creatingAccount: string;
    createAccount: string;
    forgotPassword: string;
    rememberMe: string;
    invalidCredentials: string;
    emailRequired: string;
    passwordRequired: string;
    passwordMismatch: string;
    continueWith: string;
    signUpWith: string;
    orDivider: string;
    // New additions
    emailAddress: string;
    passwordMinLength: string;
    confirmPasswordLabel: string;
    success: string;
    redirecting: string;
    invalidEmailOrPassword: string;
    passwordsDoNotMatch: string;
    continueWithGoogle: string;
    continueWithMicrosoft: string;
    continueWithGitHub: string;
    demoHint: string;
    fleetManager: string;
    dispatcher: string;
    safetyOfficer: string;
    financialAnalyst: string;
    sending: string;
  };

  // Dashboard
  dashboard: {
    title: string;
    overview: string;
    statistics: string;
    recentActivity: string;
    alerts: string;
    quickActions: string;
    // New additions
    activeFleet: string;
    maintenanceAlerts: string;
    pendingCargo: string;
    utilizationRate: string;
    recentTrips: string;
    criticalAlerts: string;
    lastUpdated: string;
    justNow: string;
    minutesAgo: string;
    allStatus: string;
    allTypes: string;
    onTrip: string;
    available: string;
    inShop: string;
    trucks: string;
    vans: string;
    containers: string;
    viewAll: string;
    noTripsFound: string;
    noAlertsFound: string;
    vehiclesOnRoad: string;
    vehiclesInShop: string;
    waitingForDriver: string;
    fleetEfficiency: string;
    filterBy: string;
    clearFilters: string;
    newTrip: string;
    newVehicle: string;
    tripSingular: string;
    vehicleSingular: string;
    driverSingular: string;
    actions: string;
    na: string;
    unassigned: string;
    critical: string;
    highPriority: string;
    allClear: string;
    itemsRequireAttention: string;
    noAlertsMessage: string;
    latestTripActivity: string;
    tripsShown: string;
    pending: string;
    trips: string;
  };

  // Vehicles
  vehicles: {
    title: string;
    allVehicles: string;
    addVehicle: string;
    vehicleDetails: string;
    registrationNumber: string;
    model: string;
    type: string;
    status: string;
    available: string;
    onTrip: string;
    inShop: string;
    retired: string;
    capacity: string;
    odometer: string;
    lastService: string;
    nextService: string;
    // New additions
    searchVehicles: string;
    filterByType: string;
    filterByStatus: string;
    allTypes: string;
    allStatus: string;
    sortBy: string;
    licensePlate: string;
    maxCapacity: string;
    odometerReading: string;
    addNewVehicle: string;
    saving: string;
    vehicleAdded: string;
    licensePlateRequired: string;
    modelRequired: string;
    validCapacityRequired: string;
    validOdometerRequired: string;
    licensePlateExists: string;
    noVehiclesFound: string;
    truck: string;
    van: string;
    container: string;
  };

  // Trips
  trips: {
    title: string;
    allTrips: string;
    addTrip: string;
    tripDetails: string;
    origin: string;
    destination: string;
    distance: string;
    duration: string;
    startTime: string;
    endTime: string;
    driver: string;
    vehicle: string;
    status: string;
    scheduled: string;
    inProgress: string;
    completed: string;
    cancelled: string;
  };

  // Drivers
  drivers: {
    title: string;
    allDrivers: string;
    addDriver: string;
    driverDetails: string;
    name: string;
    licenseNumber: string;
    phone: string;
    experience: string;
    safetyScore: string;
    status: string;
    active: string;
    onLeave: string;
    inactive: string;
  };

  // Maintenance
  maintenance: {
    title: string;
    scheduled: string;
    completed: string;
    pending: string;
    type: string;
    cost: string;
    date: string;
    notes: string;
    serviceType: string;
    routine: string;
    repair: string;
    inspection: string;
  };

  // Fuel
  fuel: {
    title: string;
    expenses: string;
    records: string;
    amount: string;
    price: string;
    totalCost: string;
    efficiency: string;
    fillDate: string;
    location: string;
  };

  // Analytics
  analytics: {
    title: string;
    revenue: string;
    expenses: string;
    profit: string;
    trends: string;
    reports: string;
    performance: string;
    comparison: string;
  };

  // Profile
  profile: {
    title: string;
    personalInfo: string;
    editProfile: string;
    saveChanges: string;
    accountSettings: string;
    bio: string;
    department: string;
    location: string;
    memberSince: string;
    lastLogin: string;
    accountStatus: string;
    permissions: string;
    recentActivity: string;
  };

  // AI Chat
  chat: {
    title: string;
    aiAssistant: string;
    askAnything: string;
    send: string;
    sending: string;
    clearChat: string;
    quickActions: string;
    vehicleStatus: string;
    planTrip: string;
    checkMaintenance: string;
    greeting: string;
    typing: string;
    online: string;
  };

  // Time
  time: {
    today: string;
    yesterday: string;
    tomorrow: string;
    week: string;
    month: string;
    year: string;
    hours: string;
    minutes: string;
    seconds: string;
    days: string;
    ago: string;
  };
}

export const translations: Record<Language, Translations> = {
  en: {
    common: {
      welcome: 'Welcome',
      loading: 'Loading...',
      save: 'Save',
      cancel: 'Cancel',
      edit: 'Edit',
      delete: 'Delete',
      confirm: 'Confirm',
      search: 'Search',
      filter: 'Filter',
      clear: 'Clear',
      submit: 'Submit',
      close: 'Close',
      back: 'Back',
      next: 'Next',
      previous: 'Previous',
      yes: 'Yes',
      no: 'No',
    },
    nav: {
      dashboard: 'Dashboard',
      vehicles: 'Vehicles',
      trips: 'Trips',
      maintenance: 'Maintenance',
      fuel: 'Fuel',
      drivers: 'Drivers',
      analytics: 'Analytics',
      profile: 'Profile',
      aiAssistant: 'AI Assistant',
      logout: 'Logout',
      commandCenter: 'Command Center',
      fuelExpenses: 'Fuel & Expenses',
      financialAnalytics: 'Financial Analytics',
    },
    auth: {
      login: 'Login',
      register: 'Register',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      fullName: 'Full Name',
      role: 'Role',
      signIn: 'Sign In',
      signUp: 'Sign Up',
      signingIn: 'Signing in...',
      creatingAccount: 'Creating account...',
      createAccount: 'Create Account',
      forgotPassword: 'Forgot Password?',
      rememberMe: 'Remember Me',
      invalidCredentials: 'Invalid credentials',
      emailRequired: 'Email is required',
      passwordRequired: 'Password is required',
      passwordMismatch: 'Passwords do not match',
      continueWith: 'Continue with',
      signUpWith: 'Sign up with',
      orDivider: 'OR',
      emailAddress: 'Email address',
      passwordMinLength: 'Password (min 6 characters)',
      confirmPasswordLabel: 'Confirm password',
      success: 'Success!',
      redirecting: 'Redirecting to dashboard...',
      invalidEmailOrPassword: 'Invalid email or password',
      passwordsDoNotMatch: 'Passwords do not match',
      continueWithGoogle: 'Continue with Google',
      continueWithMicrosoft: 'Continue with Microsoft',
      continueWithGitHub: 'Continue with GitHub',
      demoHint: 'Demo: manager@fleetflow.com / password123',
      fleetManager: 'Fleet Manager',
      dispatcher: 'Dispatcher',
      safetyOfficer: 'Safety Officer',
      financialAnalyst: 'Financial Analyst',
      sending: 'Sending...',
    },
    dashboard: {
      title: 'Dashboard',
      overview: 'Overview',
      statistics: 'Statistics',
      recentActivity: 'Recent Activity',
      alerts: 'Alerts',
      quickActions: 'Quick Actions',
      activeFleet: 'Active Fleet',
      maintenanceAlerts: 'Maintenance Alerts',
      pendingCargo: 'Pending Cargo',
      utilizationRate: 'Utilization Rate',
      recentTrips: 'Recent Trips',
      criticalAlerts: 'Critical Alerts',
      lastUpdated: 'Last Updated',
      justNow: 'Just now',
      minutesAgo: 'min ago',
      allStatus: 'All Status',
      allTypes: 'All Types',
      onTrip: 'On Trip',
      available: 'Available',
      inShop: 'In Shop',
      trucks: 'Trucks',
      vans: 'Vans',
      containers: 'Containers',
      viewAll: 'View All',
      noTripsFound: 'No trips found',
      noAlertsFound: 'No alerts found',
      vehiclesOnRoad: 'Vehicles on the road',
      vehiclesInShop: 'Vehicles in shop',
      waitingForDriver: 'Waiting for driver',
      fleetEfficiency: 'Fleet efficiency',
      filterBy: 'Filter by:',
      clearFilters: 'Clear Filters',
      newTrip: 'New Trip',
      newVehicle: 'New Vehicle',
      tripSingular: 'Trip',
      vehicleSingular: 'Vehicle',
      driverSingular: 'Driver',
      actions: 'Actions',
      na: 'N/A',
      unassigned: 'Unassigned',
      critical: 'Critical',
      highPriority: 'High Priority',
      allClear: 'All Clear!',
      itemsRequireAttention: 'items require attention',
      noAlertsMessage: 'No critical alerts at the moment',
      latestTripActivity: 'Latest trip activity across your fleet',
      tripsShown: 'trips shown',
      pending: 'pending',
      trips: 'trips',
    },
    vehicles: {
      title: 'Vehicles',
      allVehicles: 'All Vehicles',
      addVehicle: 'Add Vehicle',
      vehicleDetails: 'Vehicle Details',
      registrationNumber: 'Registration Number',
      model: 'Model',
      type: 'Type',
      status: 'Status',
      available: 'Available',
      onTrip: 'On Trip',
      inShop: 'In Shop',
      retired: 'Retired',
      capacity: 'Capacity',
      odometer: 'Odometer',
      lastService: 'Last Service',
      nextService: 'Next Service',
      searchVehicles: 'Search vehicles...',
      filterByType: 'Filter by Type',
      filterByStatus: 'Filter by Status',
      allTypes: 'All Types',
      allStatus: 'All Status',
      sortBy: 'Sort By',
      licensePlate: 'License Plate',
      maxCapacity: 'Max Capacity',
      odometerReading: 'Odometer Reading',
      addNewVehicle: 'Add New Vehicle',
      saving: 'Saving...',
      vehicleAdded: 'Vehicle added successfully!',
      licensePlateRequired: 'License plate is required',
      modelRequired: 'Model is required',
      validCapacityRequired: 'Valid capacity required',
      validOdometerRequired: 'Valid odometer required',
      licensePlateExists: 'License plate already exists',
      noVehiclesFound: 'No vehicles found',
      truck: 'Truck',
      van: 'Van',
      container: 'Container',
    },
    trips: {
      title: 'Trips',
      allTrips: 'All Trips',
      addTrip: 'Add Trip',
      tripDetails: 'Trip Details',
      origin: 'Origin',
      destination: 'Destination',
      distance: 'Distance',
      duration: 'Duration',
      startTime: 'Start Time',
      endTime: 'End Time',
      driver: 'Driver',
      vehicle: 'Vehicle',
      status: 'Status',
      scheduled: 'Scheduled',
      inProgress: 'In Progress',
      completed: 'Completed',
      cancelled: 'Cancelled',
    },
    drivers: {
      title: 'Drivers',
      allDrivers: 'All Drivers',
      addDriver: 'Add Driver',
      driverDetails: 'Driver Details',
      name: 'Name',
      licenseNumber: 'License Number',
      phone: 'Phone',
      experience: 'Experience',
      safetyScore: 'Safety Score',
      status: 'Status',
      active: 'Active',
      onLeave: 'On Leave',
      inactive: 'Inactive',
    },
    maintenance: {
      title: 'Maintenance',
      scheduled: 'Scheduled',
      completed: 'Completed',
      pending: 'Pending',
      type: 'Type',
      cost: 'Cost',
      date: 'Date',
      notes: 'Notes',
      serviceType: 'Service Type',
      routine: 'Routine',
      repair: 'Repair',
      inspection: 'Inspection',
    },
    fuel: {
      title: 'Fuel',
      expenses: 'Expenses',
      records: 'Records',
      amount: 'Amount',
      price: 'Price',
      totalCost: 'Total Cost',
      efficiency: 'Efficiency',
      fillDate: 'Fill Date',
      location: 'Location',
    },
    analytics: {
      title: 'Analytics',
      revenue: 'Revenue',
      expenses: 'Expenses',
      profit: 'Profit',
      trends: 'Trends',
      reports: 'Reports',
      performance: 'Performance',
      comparison: 'Comparison',
    },
    profile: {
      title: 'Profile',
      personalInfo: 'Personal Information',
      editProfile: 'Edit Profile',
      saveChanges: 'Save Changes',
      accountSettings: 'Account Settings',
      bio: 'Bio',
      department: 'Department',
      location: 'Location',
      memberSince: 'Member Since',
      lastLogin: 'Last Login',
      accountStatus: 'Account Status',
      permissions: 'Access Permissions',
      recentActivity: 'Recent Activity',
    },
    chat: {
      title: 'AI Chat',
      aiAssistant: 'AI Assistant',
      askAnything: 'Ask me anything...',
      send: 'Send',
      sending: 'Sending...',
      clearChat: 'Clear Chat',
      quickActions: 'Quick Actions',
      vehicleStatus: 'Vehicle Status',
      planTrip: 'Quick Trip',
      checkMaintenance: 'Maintenance',
      greeting: 'Hello! How can I help you today?',
      typing: 'Typing...',
      online: 'Online',
    },
    time: {
      today: 'Today',
      yesterday: 'Yesterday',
      tomorrow: 'Tomorrow',
      week: 'Week',
      month: 'Month',
      year: 'Year',
      hours: 'hours',
      minutes: 'minutes',
      seconds: 'seconds',
      days: 'days',
      ago: 'ago',
    },
  },
  hi: {
    common: {
      welcome: 'स्वागत है',
      loading: 'लोड हो रहा है...',
      save: 'सेव करें',
      cancel: 'रद्द करें',
      edit: 'संपादित करें',
      delete: 'हटाएं',
      confirm: 'पुष्टि करें',
      search: 'खोजें',
      filter: 'फ़िल्टर',
      clear: 'साफ़ करें',
      submit: 'जमा करें',
      close: 'बंद करें',
      back: 'वापस',
      next: 'अगला',
      previous: 'पिछला',
      yes: 'हाँ',
      no: 'नहीं',
    },
    nav: {
      dashboard: 'डैशबोर्ड',
      vehicles: 'वाहन',
      trips: 'यात्राएं',
      maintenance: 'रखरखाव',
      fuel: 'ईंधन',
      drivers: 'चालक',
      analytics: 'विश्लेषण',
      profile: 'प्रोफ़ाइल',
      aiAssistant: 'AI सहायक',
      logout: 'लॉगआउट',
      commandCenter: 'कमांड सेंटर',
      fuelExpenses: 'ईंधन और खर्च',
      financialAnalytics: 'वित्तीय विश्लेषण',
    },
    auth: {
      login: 'लॉगिन',
      register: 'रजिस्टर',
      email: 'ईमेल',
      password: 'पासवर्ड',
      confirmPassword: 'पासवर्ड की पुष्टि करें',
      fullName: 'पूरा नाम',
      role: 'भूमिका',
      signIn: 'साइन इन करें',
      signUp: 'साइन अप करें',
      signingIn: 'साइन इन हो रहा है...',
      creatingAccount: 'खाता बनाया जा रहा है...',
      createAccount: 'खाता बनाएं',
      forgotPassword: 'पासवर्ड भूल गए?',
      rememberMe: 'मुझे याद रखें',
      invalidCredentials: 'अमान्य क्रेडेंशियल',
      emailRequired: 'ईमेल आवश्यक है',
      passwordRequired: 'पासवर्ड आवश्यक है',
      passwordMismatch: 'पासवर्ड मेल नहीं खाते',
      continueWith: 'के साथ जारी रखें',
      signUpWith: 'के साथ साइन अप करें',
      orDivider: 'या',
      emailAddress: 'ईमेल पता',
      passwordMinLength: 'पासवर्ड (कम से कम 6 वर्ण)',
      confirmPasswordLabel: 'पासवर्ड की पुष्टि करें',
      success: 'सफलता!',
      redirecting: 'डैशबोर्ड पर जा रहे हैं...',
      invalidEmailOrPassword: 'अमान्य ईमेल या पासवर्ड',
      passwordsDoNotMatch: 'पासवर्ड मेल नहीं खाते',
      continueWithGoogle: 'Google के साथ जारी रखें',
      continueWithMicrosoft: 'Microsoft के साथ जारी रखें',
      continueWithGitHub: 'GitHub के साथ जारी रखें',
      demoHint: 'डेमो: manager@fleetflow.com / password123',
      fleetManager: 'फ्लीट मैनेजर',
      dispatcher: 'डिस्पैचर',
      safetyOfficer: 'सुरक्षा अधिकारी',
      financialAnalyst: 'वित्तीय विश्लेषक',
      sending: 'भेजा जा रहा है...',
    },
    dashboard: {
      title: 'डैशबोर्ड',
      overview: 'अवलोकन',
      statistics: 'सांख्यिकी',
      recentActivity: 'हाल की गतिविधि',
      alerts: 'अलर्ट',
      quickActions: 'त्वरित क्रियाएं',
      activeFleet: 'सक्रिय फ्लीट',
      maintenanceAlerts: 'रखरखाव अलर्ट',
      pendingCargo: 'लंबित कार्गो',
      utilizationRate: 'उपयोग दर',
      recentTrips: 'हाल की यात्राएं',
      criticalAlerts: 'महत्वपूर्ण अलर्ट',
      lastUpdated: 'अंतिम अपडेट',
      justNow: 'अभी',
      minutesAgo: 'मिनट पहले',
      allStatus: 'सभी स्थिति',
      allTypes: 'सभी प्रकार',
      onTrip: 'यात्रा पर',
      available: 'उपलब्ध',
      inShop: 'दुकान में',
      trucks: 'ट्रक',
      vans: 'वैन',
      containers: 'कंटेनर',
      viewAll: 'सभी देखें',
      noTripsFound: 'कोई यात्रा नहीं मिली',
      noAlertsFound: 'कोई अलर्ट नहीं मिला',
      vehiclesOnRoad: 'सड़क पर वाहन',
      vehiclesInShop: 'दुकान में वाहन',
      waitingForDriver: 'चालक की प्रतीक्षा में',
      fleetEfficiency: 'फ्लीट दक्षता',
      filterBy: 'फ़िल्टर करें:',
      clearFilters: 'फ़िल्टर साफ़ करें',
      newTrip: 'नई यात्रा',
      newVehicle: 'नया वाहन',
      tripSingular: 'यात्रा',
      vehicleSingular: 'वाहन',
      driverSingular: 'चालक',
      actions: 'क्रियाएं',
      na: 'उपलब्ध नहीं',
      unassigned: 'असाइन नहीं किया गया',
      critical: 'महत्वपूर्ण',
      highPriority: 'उच्च प्राथमिकता',
      allClear: 'सब ठीक है!',
      itemsRequireAttention: 'आइटम ध्यान देने की आवश्यकता है',
      noAlertsMessage: 'अभी कोई महत्वपूर्ण अलर्ट नहीं',
      latestTripActivity: 'आपके फ्लीट में नवीनतम यात्रा गतिविधि',
      tripsShown: 'यात्राएं दिखाई गईं',
      pending: 'लंबित',
      trips: 'यात्राएं',
    },
    vehicles: {
      title: 'वाहन',
      allVehicles: 'सभी वाहन',
      addVehicle: 'वाहन जोड़ें',
      vehicleDetails: 'वाहन विवरण',
      registrationNumber: 'पंजीकरण संख्या',
      model: 'मॉडल',
      type: 'प्रकार',
      status: 'स्थिति',
      available: 'उपलब्ध',
      onTrip: 'यात्रा पर',
      inShop: 'दुकान में',
      retired: 'सेवानिवृत्त',
      capacity: 'क्षमता',
      odometer: 'ओडोमीटर',
      lastService: 'अंतिम सेवा',
      nextService: 'अगली सेवा',
      searchVehicles: 'वाहन खोजें...',
      filterByType: 'प्रकार से फ़िल्टर करें',
      filterByStatus: 'स्थिति से फ़िल्टर करें',
      allTypes: 'सभी प्रकार',
      allStatus: 'सभी स्थिति',
      sortBy: 'इसके अनुसार क्रमबद्ध करें',
      licensePlate: 'लाइसेंस प्लेट',
      maxCapacity: 'अधिकतम क्षमता',
      odometerReading: 'ओडोमीटर रीडिंग',
      addNewVehicle: 'नया वाहन जोड़ें',
      saving: 'सहेजा जा रहा है...',
      vehicleAdded: 'वाहन सफलतापूर्वक जोड़ा गया!',
      licensePlateRequired: 'लाइसेंस प्लेट आवश्यक है',
      modelRequired: 'मॉडल आवश्यक है',
      validCapacityRequired: 'मान्य क्षमता आवश्यक है',
      validOdometerRequired: 'मान्य ओडोमीटर आवश्यक है',
      licensePlateExists: 'लाइसेंस प्लेट पहले से मौजूद है',
      noVehiclesFound: 'कोई वाहन नहीं मिला',
      truck: 'ट्रक',
      van: 'वैन',
      container: 'कंटेनर',
    },
    trips: {
      title: 'यात्राएं',
      allTrips: 'सभी यात्राएं',
      addTrip: 'यात्रा जोड़ें',
      tripDetails: 'यात्रा विवरण',
      origin: 'प्रस्थान',
      destination: 'गंतव्य',
      distance: 'दूरी',
      duration: 'अवधि',
      startTime: 'प्रारंभ समय',
      endTime: 'समाप्ति समय',
      driver: 'चालक',
      vehicle: 'वाहन',
      status: 'स्थिति',
      scheduled: 'निर्धारित',
      inProgress: 'प्रगति में',
      completed: 'पूर्ण',
      cancelled: 'रद्द',
    },
    drivers: {
      title: 'चालक',
      allDrivers: 'सभी चालक',
      addDriver: 'चालक जोड़ें',
      driverDetails: 'चालक विवरण',
      name: 'नाम',
      licenseNumber: 'लाइसेंस नंबर',
      phone: 'फ़ोन',
      experience: 'अनुभव',
      safetyScore: 'सुरक्षा स्कोर',
      status: 'स्थिति',
      active: 'सक्रिय',
      onLeave: 'छुट्टी पर',
      inactive: 'निष्क्रिय',
    },
    maintenance: {
      title: 'रखरखाव',
      scheduled: 'निर्धारित',
      completed: 'पूर्ण',
      pending: 'लंबित',
      type: 'प्रकार',
      cost: 'लागत',
      date: 'तारीख',
      notes: 'नोट्स',
      serviceType: 'सेवा प्रकार',
      routine: 'नियमित',
      repair: 'मरम्मत',
      inspection: 'निरीक्षण',
    },
    fuel: {
      title: 'ईंधन',
      expenses: 'खर्चे',
      records: 'रिकॉर्ड',
      amount: 'मात्रा',
      price: 'कीमत',
      totalCost: 'कुल लागत',
      efficiency: 'दक्षता',
      fillDate: 'भरने की तारीख',
      location: 'स्थान',
    },
    analytics: {
      title: 'विश्लेषण',
      revenue: 'राजस्व',
      expenses: 'खर्चे',
      profit: 'लाभ',
      trends: 'रुझान',
      reports: 'रिपोर्ट',
      performance: 'प्रदर्शन',
      comparison: 'तुलना',
    },
    profile: {
      title: 'प्रोफ़ाइल',
      personalInfo: 'व्यक्तिगत जानकारी',
      editProfile: 'प्रोफ़ाइल संपादित करें',
      saveChanges: 'परिवर्तन सेव करें',
      accountSettings: 'खाता सेटिंग्स',
      bio: 'परिचय',
      department: 'विभाग',
      location: 'स्थान',
      memberSince: 'सदस्य बने',
      lastLogin: 'अंतिम लॉगिन',
      accountStatus: 'खाता स्थिति',
      permissions: 'पहुंच अनुमतियां',
      recentActivity: 'हाल की गतिविधि',
    },
    chat: {
      title: 'AI चैट',
      aiAssistant: 'AI सहायक',
      askAnything: 'कुछ भी पूछें...',
      send: 'भेजें',
      sending: 'भेजा जा रहा है...',
      clearChat: 'चैट साफ़ करें',
      quickActions: 'त्वरित क्रियाएं',
      vehicleStatus: 'वाहन स्थिति',
      planTrip: 'त्वरित यात्रा',
      checkMaintenance: 'रखरखाव',
      greeting: 'नमस्ते! आज मैं आपकी कैसे मदद कर सकता हूं?',
      typing: 'टाइप कर रहे हैं...',
      online: 'ऑनलाइन',
    },
    time: {
      today: 'आज',
      yesterday: 'कल',
      tomorrow: 'कल',
      week: 'सप्ताह',
      month: 'महीना',
      year: 'साल',
      hours: 'घंटे',
      minutes: 'मिनट',
      seconds: 'सेकंड',
      days: 'दिन',
      ago: 'पहले',
    },
  },
  mr: {
    common: {
      welcome: 'स्वागत आहे',
      loading: 'लोड होत आहे...',
      save: 'जतन करा',
      cancel: 'रद्द करा',
      edit: 'संपादित करा',
      delete: 'हटवा',
      confirm: 'पुष्टी करा',
      search: 'शोधा',
      filter: 'फिल्टर',
      clear: 'साफ करा',
      submit: 'सबमिट करा',
      close: 'बंद करा',
      back: 'मागे',
      next: 'पुढे',
      previous: 'मागील',
      yes: 'होय',
      no: 'नाही',
    },
    nav: {
      dashboard: 'डॅशबोर्ड',
      vehicles: 'वाहने',
      trips: 'सफर',
      maintenance: 'देखभाल',
      fuel: 'इंधन',
      drivers: 'चालक',
      analytics: 'विश्लेषण',
      profile: 'प्रोफाइल',
      aiAssistant: 'AI सहाय्यक',
      logout: 'लॉगआउट',
      commandCenter: 'कमांड सेंटर',
      fuelExpenses: 'इंधन आणि खर्च',
      financialAnalytics: 'आर्थिक विश्लेषण',
    },
    auth: {
      login: 'लॉगिन',
      register: 'नोंदणी',
      email: 'ईमेल',
      password: 'पासवर्ड',
      confirmPassword: 'पासवर्ड पुष्टी करा',
      fullName: 'पूर्ण नाव',
      role: 'भूमिका',
      signIn: 'साइन इन करा',
      signUp: 'साइन अप करा',
      signingIn: 'साइन इन होत आहे...',
      creatingAccount: 'खाते तयार होत आहे...',
      createAccount: 'खाते तयार करा',
      forgotPassword: 'पासवर्ड विसरलात?',
      rememberMe: 'मला लक्षात ठेवा',
      invalidCredentials: 'अवैध क्रेडेन्शियल्स',
      emailRequired: 'ईमेल आवश्यक आहे',
      passwordRequired: 'पासवर्ड आवश्यक आहे',
      passwordMismatch: 'पासवर्ड जुळत नाहीत',
      continueWith: 'सह सुरू ठेवा',
      signUpWith: 'सह साइन अप करा',
      orDivider: 'किंवा',
      emailAddress: 'ईमेल पत्ता',
      passwordMinLength: 'पासवर्ड (किमान 6 वर्ण)',
      confirmPasswordLabel: 'पासवर्ड पुष्टी करा',
      success: 'यश!',
      redirecting: 'डॅशबोर्डवर पुनर्निर्देशित करत आहे...',
      invalidEmailOrPassword: 'अवैध ईमेल किंवा पासवर्ड',
      passwordsDoNotMatch: 'पासवर्ड जुळत नाहीत',
      continueWithGoogle: 'Google सह सुरू ठेवा',
      continueWithMicrosoft: 'Microsoft सह सुरू ठेवा',
      continueWithGitHub: 'GitHub सह सुरू ठेवा',
      demoHint: 'डेमो: manager@fleetflow.com / password123',
      fleetManager: 'फ्लीट मॅनेजर',
      dispatcher: 'प्रेषक',
      safetyOfficer: 'सुरक्षा अधिकारी',
      financialAnalyst: 'आर्थिक विश्लेषक',
      sending: 'पाठवत आहे...',
    },
    dashboard: {
      title: 'डॅशबोर्ड',
      overview: 'विहंगावलोकन',
      statistics: 'सांख्यिकी',
      recentActivity: 'अलीकडील क्रियाकलाप',
      alerts: 'सूचना',
      quickActions: 'जलद क्रिया',
      activeFleet: 'सक्रिय फ्लीट',
      maintenanceAlerts: 'देखभाल सूचना',
      pendingCargo: 'प्रलंबित कार्गो',
      utilizationRate: 'वापर दर',
      recentTrips: 'अलीकडील सफर',
      criticalAlerts: 'गंभीर सूचना',
      lastUpdated: 'शेवटचे अद्यतन',
      justNow: 'आत्ताच',
      minutesAgo: 'मिनिटांपूर्वी',
      allStatus: 'सर्व स्थिती',
      allTypes: 'सर्व प्रकार',
      onTrip: 'सफरीवर',
      available: 'उपलब्ध',
      inShop: 'दुकानात',
      trucks: 'ट्रक',
      vans: 'व्हॅन',
      containers: 'कंटेनर',
      viewAll: 'सर्व पहा',
      noTripsFound: 'कोणतीही सफर आढळली नाही',
      noAlertsFound: 'कोणतीही सूचना आढळली नाही',
      vehiclesOnRoad: 'रस्त्यावर वाहने',
      vehiclesInShop: 'दुकानात वाहने',
      waitingForDriver: 'चालकाची प्रतीक्षा',
      fleetEfficiency: 'फ्लीट कार्यक्षमता',
      filterBy: 'फिल्टर करा:',
      clearFilters: 'फिल्टर साफ करा',
      newTrip: 'नवीन सफर',
      newVehicle: 'नवीन वाहन',
      tripSingular: 'सफर',
      vehicleSingular: 'वाहन',
      driverSingular: 'चालक',
      actions: 'क्रिया',
      na: 'उपलब्ध नाही',
      unassigned: 'नियुक्त नाही',
      critical: 'गंभीर',
      highPriority: 'उच्च प्राधान्य',
      allClear: 'सर्व ठीक आहे!',
      itemsRequireAttention: 'आयटम्स लक्ष द्यावे',
      noAlertsMessage: 'सध्या कोणत्याही गंभीर सूचना नाहीत',
      latestTripActivity: 'तुमच्या फ्लीटमधील नवीनतम सफर क्रियाकलाप',
      tripsShown: 'सफर दाखवल्या',
      pending: 'प्रलंबित',
      trips: 'सफर',
    },
    vehicles: {
      title: 'वाहने',
      allVehicles: 'सर्व वाहने',
      addVehicle: 'वाहन जोडा',
      vehicleDetails: 'वाहन तपशील',
      registrationNumber: 'नोंदणी क्रमांक',
      model: 'मॉडेल',
      type: 'प्रकार',
      status: 'स्थिती',
      available: 'उपलब्ध',
      onTrip: 'सफरीवर',
      inShop: 'दुकानात',
      retired: 'निवृत्त',
      capacity: 'क्षमता',
      odometer: 'ओडोमीटर',
      lastService: 'शेवटची सेवा',
      nextService: 'पुढील सेवा',
      searchVehicles: 'वाहने शोधा',
      filterByType: 'प्रकारानुसार फिल्टर करा',
      filterByStatus: 'स्थितीनुसार फिल्टर करा',
      allTypes: 'सर्व प्रकार',
      allStatus: 'सर्व स्थिती',
      sortBy: 'क्रम लावा',
      licensePlate: 'लायसन्स प्लेट',
      maxCapacity: 'कमाल क्षमता',
      odometerReading: 'ओडोमीटर रीडिंग',
      addNewVehicle: 'नवीन वाहन जोडा',
      saving: 'जतन करत आहे...',
      vehicleAdded: 'वाहन जोडले',
      licensePlateRequired: 'लायसन्स प्लेट आवश्यक आहे',
      modelRequired: 'मॉडेल आवश्यक आहे',
      validCapacityRequired: 'वैध क्षमता आवश्यक आहे',
      validOdometerRequired: 'वैध ओडोमीटर आवश्यक आहे',
      licensePlateExists: 'लायसन्स प्लेट आधीपासूनच अस्तित्वात आहे',
      noVehiclesFound: 'कोणतीही वाहने आढळली नाहीत',
      truck: 'ट्रक',
      van: 'व्हॅन',
      container: 'कंटेनर',
    },
    trips: {
      title: 'सफर',
      allTrips: 'सर्व सफर',
      addTrip: 'सफर जोडा',
      tripDetails: 'सफर तपशील',
      origin: 'प्रारंभ',
      destination: 'गंतव्य',
      distance: 'अंतर',
      duration: 'कालावधी',
      startTime: 'सुरुवात वेळ',
      endTime: 'समाप्ती वेळ',
      driver: 'चालक',
      vehicle: 'वाहन',
      status: 'स्थिती',
      scheduled: 'नियोजित',
      inProgress: 'प्रगतीपथावर',
      completed: 'पूर्ण',
      cancelled: 'रद्द',
    },
    drivers: {
      title: 'चालक',
      allDrivers: 'सर्व चालक',
      addDriver: 'चालक जोडा',
      driverDetails: 'चालक तपशील',
      name: 'नाव',
      licenseNumber: 'लायसन्स नंबर',
      phone: 'फोन',
      experience: 'अनुभव',
      safetyScore: 'सुरक्षा स्कोअर',
      status: 'स्थिती',
      active: 'सक्रिय',
      onLeave: 'रजेवर',
      inactive: 'निष्क्रिय',
    },
    maintenance: {
      title: 'देखभाल',
      scheduled: 'नियोजित',
      completed: 'पूर्ण',
      pending: 'प्रलंबित',
      type: 'प्रकार',
      cost: 'खर्च',
      date: 'तारीख',
      notes: 'नोट्स',
      serviceType: 'सेवा प्रकार',
      routine: 'नियमित',
      repair: 'दुरुस्ती',
      inspection: 'तपासणी',
    },
    fuel: {
      title: 'इंधन',
      expenses: 'खर्च',
      records: 'रेकॉर्ड',
      amount: 'प्रमाण',
      price: 'किंमत',
      totalCost: 'एकूण खर्च',
      efficiency: 'कार्यक्षमता',
      fillDate: 'भरल्याची तारीख',
      location: 'स्थान',
    },
    analytics: {
      title: 'विश्लेषण',
      revenue: 'महसूल',
      expenses: 'खर्च',
      profit: 'नफा',
      trends: 'ट्रेंड',
      reports: 'अहवाल',
      performance: 'कामगिरी',
      comparison: 'तुलना',
    },
    profile: {
      title: 'प्रोफाइल',
      personalInfo: 'वैयक्तिक माहिती',
      editProfile: 'प्रोफाइल संपादित करा',
      saveChanges: 'बदल जतन करा',
      accountSettings: 'खाते सेटिंग्ज',
      bio: 'परिचय',
      department: 'विभाग',
      location: 'स्थान',
      memberSince: 'सदस्य झाल्यापासून',
      lastLogin: 'शेवटचे लॉगिन',
      accountStatus: 'खाते स्थिती',
      permissions: 'प्रवेश परवानग्या',
      recentActivity: 'अलीकडील क्रियाकलाप',
    },
    chat: {
      title: 'AI चॅट',
      aiAssistant: 'AI सहाय्यक',
      askAnything: 'काहीही विचारा...',
      send: 'पाठवा',
      sending: 'पाठवत आहे...',
      clearChat: 'चॅट साफ करा',
      quickActions: 'जलद क्रिया',
      vehicleStatus: 'वाहन स्थिती',
      planTrip: 'जलद सफर',
      checkMaintenance: 'देखभाल',
      greeting: 'नमस्कार! आज मी तुम्हाला कशी मदत करू शकतो?',
      typing: 'टाइप करत आहे...',
      online: 'ऑनलाइन',
    },
    time: {
      today: 'आज',
      yesterday: 'काल',
      tomorrow: 'उद्या',
      week: 'आठवडा',
      month: 'महिना',
      year: 'वर्ष',
      hours: 'तास',
      minutes: 'मिनिटे',
      seconds: 'सेकंद',
      days: 'दिवस',
      ago: 'आधी',
    },
  },
  ta: {
    common: {
      welcome: 'வரவேற்கிறோம்',
      loading: 'ஏற்றுகிறது...',
      save: 'சேமி',
      cancel: 'ரத்து செய்',
      edit: 'திருத்து',
      delete: 'நீக்கு',
      confirm: 'உறுதிப்படுத்து',
      search: 'தேடு',
      filter: 'வடிகட்டு',
      clear: 'அழி',
      submit: 'சமர்ப்பி',
      close: 'மூடு',
      back: 'பின்',
      next: 'அடுத்து',
      previous: 'முந்தைய',
      yes: 'ஆம்',
      no: 'இல்லை',
    },
    nav: {
      dashboard: 'டாஷ்போர்டு',
      vehicles: 'வாகனங்கள்',
      trips: 'பயணங்கள்',
      maintenance: 'பராமரிப்பு',
      fuel: 'எரிபொருள்',
      drivers: 'ஓட்டுநர்கள்',
      analytics: 'பகுப்பாய்வு',
      profile: 'சுயவிவரம்',
      aiAssistant: 'AI உதவியாளர்',
      logout: 'வெளியேறு',
      commandCenter: 'கட்டளை மையம்',
      fuelExpenses: 'எரிபொருள் மற்றும் செலவுகள்',
      financialAnalytics: 'நிதி பகுப்பாய்வு',
    },
    auth: {
      login: 'உள்நுழைவு',
      register: 'பதிவு',
      email: 'மின்னஞ்சல்',
      password: 'கடவுச்சொல்',
      confirmPassword: 'கடவுச்சொல்லை உறுதிப்படுத்து',
      fullName: 'முழு பெயர்',
      role: 'பங்கு',
      signIn: 'உள்நுழை',
      signUp: 'பதிவு செய்',
      signingIn: 'உள்நுழைகிறது...',
      creatingAccount: 'கணக்கு உருவாக்கப்படுகிறது...',
      createAccount: 'கணக்கை உருவாக்கு',
      forgotPassword: 'கடவுச்சொல்லை மறந்துவிட்டீர்களா?',
      rememberMe: 'என்னை நினைவில் வைத்திரு',
      invalidCredentials: 'தவறான சான்றுகள்',
      emailRequired: 'மின்னஞ்சல் தேவை',
      passwordRequired: 'கடவுச்சொல் தேவை',
      passwordMismatch: 'கடவுச்சொற்கள் பொருந்தவில்லை',
      continueWith: 'உடன் தொடரவும்',
      signUpWith: 'உடன் பதிவு செய்',
      orDivider: 'அல்லது',
      emailAddress: 'மின்னஞ்சல் முகவரி',
      passwordMinLength: 'கடவுச்சொல் (குறைந்தது 6 எழுத்துக்கள்)',
      confirmPasswordLabel: 'கடவுச்சொல்லை உறுதிப்படுத்து',
      success: 'வெற்றி!',
      redirecting: 'டாஷ்போர்டுக்கு திருப்பிவிடப்படுகிறது...',
      invalidEmailOrPassword: 'தவறான மின்னஞ்சல் அல்லது கடவுச்சொல்',
      passwordsDoNotMatch: 'கடவுச்சொற்கள் பொருந்தவில்லை',
      continueWithGoogle: 'Google உடன் தொடரவும்',
      continueWithMicrosoft: 'Microsoft உடன் தொடரவும்',
      continueWithGitHub: 'GitHub உடன் தொடரவும்',
      demoHint: 'டெமோ: manager@fleetflow.com / password123',
      fleetManager: 'கடற்படை மேலாளர்',
      dispatcher: 'அனுப்புநர்',
      safetyOfficer: 'பாதுகாப்பு அதிகாரி',
      financialAnalyst: 'நிதி ஆய்வாளர்',
      sending: 'அனுப்புகிறது...',
    },
    dashboard: {
      title: 'டாஷ்போர்டு',
      overview: 'மேலோட்டம்',
      statistics: 'புள்ளிவிவரங்கள்',
      recentActivity: 'சமீபத்திய செயல்பாடு',
      alerts: 'எச்சரிக்கைகள்',
      quickActions: 'விரைவு நடவடிக்கைகள்',
      activeFleet: 'செயலில் உள்ள கடற்படை',
      maintenanceAlerts: 'பராமரிப்பு எச்சரிக்கைகள்',
      pendingCargo: 'நிலுவையில் உள்ள சரக்கு',
      utilizationRate: 'பயன்பாட்டு விகிதம்',
      recentTrips: 'சமீபத்திய பயணங்கள்',
      criticalAlerts: 'முக்கியமான எச்சரிக்கைகள்',
      lastUpdated: 'கடைசியாக புதுப்பிக்கப்பட்டது',
      justNow: 'இப்போது தான்',
      minutesAgo: 'நிமிடங்களுக்கு முன்',
      allStatus: 'அனைத்து நிலைகள்',
      allTypes: 'அனைத்து வகைகள்',
      onTrip: 'பயணத்தில்',
      available: 'கிடைக்கும்',
      inShop: 'கடையில்',
      trucks: 'டிரக்குகள்',
      vans: 'வேன்கள்',
      containers: 'கொள்கலன்கள்',
      viewAll: 'அனைத்தையும் பார்',
      noTripsFound: 'பயணங்கள் எதுவும் இல்லை',
      noAlertsFound: 'எச்சரிக்கைகள் எதுவும் இல்லை',
      vehiclesOnRoad: 'சாலையில் வாகனங்கள்',
      vehiclesInShop: 'கடையில் வாகனங்கள்',
      waitingForDriver: 'ஓட்டுநருக்காக காத்திருக்கிறது',
      fleetEfficiency: 'கடற்படை திறன்',
      filterBy: 'வடிகட்ட:',
      clearFilters: 'வடிப்பான்களை அழி',
      newTrip: 'புதிய பயணம்',
      newVehicle: 'புதிய வாகனம்',
      tripSingular: 'பயணம்',
      vehicleSingular: 'வாகனம்',
      driverSingular: 'ஓட்டுநர்',
      actions: 'செயல்கள்',
      na: 'கிடைக்கவில்லை',
      unassigned: 'ஒதுக்கப்படவில்லை',
      critical: 'முக்கியமான',
      highPriority: 'உயர் முன்னுரிமை',
      allClear: 'அனைத்தும் தெளிவு!',
      itemsRequireAttention: 'பொருட்கள் கவனம் தேவை',
      noAlertsMessage: 'தற்போது முக்கியமான எச்சரிக்கைகள் இல்லை',
      latestTripActivity: 'உங்கள் கடற்படையில் சமீபத்திய பயண செயல்பாடு',
      tripsShown: 'பயணங்கள் காட்டப்பட்டுள்ளன',
      pending: 'நிலுவையில்',
      trips: 'பயணங்கள்',
    },
    vehicles: {
      title: 'வாகனங்கள்',
      allVehicles: 'அனைத்து வாகனங்கள்',
      addVehicle: 'வாகனம் சேர்',
      vehicleDetails: 'வாகன விவரங்கள்',
      registrationNumber: 'பதிவு எண்',
      model: 'மாடல்',
      type: 'வகை',
      status: 'நிலை',
      available: 'கிடைக்கும்',
      onTrip: 'பயணத்தில்',
      inShop: 'கடையில்',
      retired: 'ஓய்வு பெற்றது',
      capacity: 'திறன்',
      odometer: 'ஓடோமீட்டர்',
      lastService: 'கடைசி சேவை',
      nextService: 'அடுத்த சேவை',
      searchVehicles: 'வாகனங்களைத் தேடு',
      filterByType: 'வகையின்படி வடிகட்டு',
      filterByStatus: 'நிலையின்படி வடிகட்டு',
      allTypes: 'அனைத்து வகைகள்',
      allStatus: 'அனைத்து நிலைகள்',
      sortBy: 'வரிசைப்படுத்து',
      licensePlate: 'உரிமத் தகடு',
      maxCapacity: 'அதிகபட்ச திறன்',
      odometerReading: 'ஓடோமீட்டர் அளவீடு',
      addNewVehicle: 'புதிய வாகனம் சேர்',
      saving: 'சேமிக்கிறது...',
      vehicleAdded: 'வாகனம் சேர்க்கப்பட்டது',
      licensePlateRequired: 'உரிமத் தகடு தேவை',
      modelRequired: 'மாடல் தேவை',
      validCapacityRequired: 'சரியான திறன் தேவை',
      validOdometerRequired: 'சரியான ஓடோமீட்டர் தேவை',
      licensePlateExists: 'உரிமத் தகடு ஏற்கனவே உள்ளது',
      noVehiclesFound: 'வாகனங்கள் எதுவும் இல்லை',
      truck: 'டிரக்',
      van: 'வேன்',
      container: 'கொள்கலன்',
    },
    trips: {
      title: 'பயணங்கள்',
      allTrips: 'அனைத்து பயணங்கள்',
      addTrip: 'பயணம் சேர்',
      tripDetails: 'பயண விவரங்கள்',
      origin: 'தொடக்கம்',
      destination: 'இலக்கு',
      distance: 'தூரம்',
      duration: 'காலம்',
      startTime: 'தொடக்க நேரம்',
      endTime: 'முடிவு நேரம்',
      driver: 'ஓட்டுநர்',
      vehicle: 'வாகனம்',
      status: 'நிலை',
      scheduled: 'திட்டமிடப்பட்டது',
      inProgress: 'முன்னேற்றத்தில்',
      completed: 'முடிந்தது',
      cancelled: 'ரத்து செய்யப்பட்டது',
    },
    drivers: {
      title: 'ஓட்டுநர்கள்',
      allDrivers: 'அனைத்து ஓட்டுநர்கள்',
      addDriver: 'ஓட்டுநர் சேர்',
      driverDetails: 'ஓட்டுநர் விவரங்கள்',
      name: 'பெயர்',
      licenseNumber: 'உரிம எண்',
      phone: 'தொலைபேசி',
      experience: 'அனுபவம்',
      safetyScore: 'பாதுகாப்பு மதிப்பெண்',
      status: 'நிலை',
      active: 'செயலில்',
      onLeave: 'விடுமுறையில்',
      inactive: 'செயலில் இல்லை',
    },
    maintenance: {
      title: 'பராமரிப்பு',
      scheduled: 'திட்டமிடப்பட்டது',
      completed: 'முடிந்தது',
      pending: 'நிலுவையில்',
      type: 'வகை',
      cost: 'விலை',
      date: 'தேதி',
      notes: 'குறிப்புகள்',
      serviceType: 'சேவை வகை',
      routine: 'வழக்கமான',
      repair: 'பழுது',
      inspection: 'ஆய்வு',
    },
    fuel: {
      title: 'எரிபொருள்',
      expenses: 'செலவுகள்',
      records: 'பதிவுகள்',
      amount: 'அளவு',
      price: 'விலை',
      totalCost: 'மொத்த செலவு',
      efficiency: 'திறன்',
      fillDate: 'நிரப்பிய தேதி',
      location: 'இடம்',
    },
    analytics: {
      title: 'பகுப்பாய்வு',
      revenue: 'வருவாய்',
      expenses: 'செலவுகள்',
      profit: 'லாபம்',
      trends: 'போக்குகள்',
      reports: 'அறிக்கைகள்',
      performance: 'செயல்திறன்',
      comparison: 'ஒப்பீடு',
    },
    profile: {
      title: 'சுயவிவரம்',
      personalInfo: 'தனிப்பட்ட தகவல்',
      editProfile: 'சுயவிவரத்தை திருத்து',
      saveChanges: 'மாற்றங்களை சேமி',
      accountSettings: 'கணக்கு அமைப்புகள்',
      bio: 'அறிமுகம்',
      department: 'துறை',
      location: 'இடம்',
      memberSince: 'உறுப்பினரான தேதி',
      lastLogin: 'கடைசி உள்நுழைவு',
      accountStatus: 'கணக்கு நிலை',
      permissions: 'அணுகல் அனுமதிகள்',
      recentActivity: 'சமீபத்திய செயல்பாடு',
    },
    chat: {
      title: 'AI அரட்டை',
      aiAssistant: 'AI உதவியாளர்',
      askAnything: 'எதையும் கேளுங்கள்...',
      send: 'அனுப்பு',
      sending: 'அனுப்புகிறது...',
      clearChat: 'அரட்டையை அழி',
      quickActions: 'விரைவு நடவடிக்கைகள்',
      vehicleStatus: 'வாகன நிலை',
      planTrip: 'விரைவு பயணம்',
      checkMaintenance: 'பராமரிப்பு',
      greeting: 'வணக்கம்! இன்று நான் உங்களுக்கு எப்படி உதவ முடியும்?',
      typing: 'தட்டச்சு செய்கிறது...',
      online: 'ஆன்லைன்',
    },
    time: {
      today: 'இன்று',
      yesterday: 'நேற்று',
      tomorrow: 'நாளை',
      week: 'வாரம்',
      month: 'மாதம்',
      year: 'வருடம்',
      hours: 'மணி',
      minutes: 'நிமிடங்கள்',
      seconds: 'விநாடிகள்',
      days: 'நாட்கள்',
      ago: 'முன்',
    },
  },
};

export const useTranslation = () => {
  const currentLanguage = useLanguageStore((state) => state.currentLanguage);
  
  const t = translations[currentLanguage];
  
  return { t, currentLanguage };
};
