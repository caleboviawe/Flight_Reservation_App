class UserSingleton {
	constructor() {
	  if (!UserSingleton.instance) {
		this.loggedIn = false;
		this.userData = {}; 
		this.subscribers = []; 
		this.retrieveFromStorage(); 
		UserSingleton.instance = this;
	  }
	  return UserSingleton.instance;
	}
  
	setLoggedInStatus(status) {
	  this.loggedIn = status;
	  this.saveToStorage(); 
	  this.notifySubscribers(status); 
	}
  
	subscribeToLoginStatus(callback) {
	  this.subscribers.push(callback); 
	}
  
	unsubscribeFromLoginStatus(callback) {
	  this.subscribers = this.subscribers.filter(
		subscriber => subscriber !== callback
	  ); 
	}
  
	notifySubscribers(status) {
	  this.subscribers.forEach(callback => {
		callback(status); 
	  });
	}

	setUser(userData) {
		this.userData = userData; 
		this.saveToStorage(); 
	}

	getLoggedInStatus() {
		return this.loggedIn;
	}

	getUserData() {
		return this.userData;
	}

	saveToStorage() {
		localStorage.setItem('userLoggedIn', this.loggedIn);
		localStorage.setItem('userData', JSON.stringify(this.userData));
	}

	retrieveFromStorage() {
		const loggedIn = localStorage.getItem('userLoggedIn');
		const userData = localStorage.getItem('userData');

		if (loggedIn !== null) {
			this.loggedIn = JSON.parse(loggedIn);
		}

		if (userData !== null) {
			this.userData = JSON.parse(userData);
		}
	}

	static getInstance() {
		return UserSingleton.instance || new UserSingleton();
	}
}

export default UserSingleton;
