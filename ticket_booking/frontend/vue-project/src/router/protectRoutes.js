// routeGuards.js

export function checkAdmin() {
    // Check localStorage and sessionStorage for the email
    const emailStoredLocal = localStorage.getItem('email');
    const emailStoredSession = sessionStorage.getItem('email');
  
    // Check if the email matches the admin email
    const isAdmin =
      emailStoredLocal === 'admin@admin.com' || emailStoredSession === 'admin@admin.com';
  
    return isAdmin; // Return true if the user is an admin, otherwise false.
  }

  export function isAdmin(to, from, next) {
    if (checkAdmin()) {
      
      next();
    } else {
      window.alert('Your are not allowed to access this resource. If you are the admin, login with your admin credentials.')
      next('/'); 
    }
  }