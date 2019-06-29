

const firebaseConfig = {
  apiKey: "AIzaSyDox3XXQK5ePVYNztSV0qOJf6nWsS285aU",
  authDomain: "mycure-todo-app.firebaseapp.com",
  databaseURL: "https://mycure-todo-app.firebaseio.com",
  projectId: "mycure-todo-app",
  storageBucket: "",
  messagingSenderId: "508688593370",
  appId: "1:508688593370:web:1df5050b4e91b190"
}

firebase.initializeApp(firebaseConfig)

app = new Vue({
	el: "#root",
	
	data: {
		uid: '',
		email: '',
		confirmPassword: '',
		password: '',
        loginOrRegister: 'login',
		todos: [],
   		todosRef: null,
    },
	
	computed: {
        screen: function () {
          if (this.uid) {
            return 'dashboard'
          } else {
            if (this.loginOrRegister == 'register') {
              return 'register'
            }
            
	        return 'login' 
		  }
        }
    },

    watch: {
    	uid: function (newVal, oldVal) {
    		if (newVal) {
				this.todosRef = firebase.database().ref('/todos/' + newVal)
				this.todosRef.on('value', (snapshot) => {
					this.todos = snapshot.val()
				})
    		} else {
    			this.todosRef = null
    		}
    	},

    	screen: function (newVal, oldVal) {
    		this.email = ''
    		this.password = ''
    		this.confirmPassword = ''
    	},
    },

	methods: {
			setToLoginOrRegister(val) {
          		this.loginOrRegister = val
        	},
        	signup(){
        		if(this.confirmPassword == this.password){
        			firebase.auth().createUserWithEmailAndPassword(this.email, this.password).catch(function(error) { 
        				var errorCode = error.code; 
        				var errorMessage = error.message; 
        				if (errorCode == 'auth/weak-password') { 
        					alert('The password is too weak.'); 
	        			} else { 
	        				alert(errorMessage); 
        				}

        				console.log(error); 
        			});
        			this.login()
        		} else{
        			alert("Password and Confirm password doesn't match!")
        		}
        	},
        	login(){
        		firebase.auth().signInWithEmailAndPassword(this.email, this.password)
        			.then((user) => {
        				this.uid = user.user.uid
	        		}).catch(function(error) { 
        				var errorCode = error.code; 
        				var errorMessage = error.message; 
        				alert(error.message)
        				console.log(error); 
        			})
        	},
			addTodo(){
				let pushRef = this.todosRef.push()
				pushRef.set({
					name: "",
					description: "",
					deadline: ""})
			},
			deleteTodo(index){
				this.todosRef.child(index).remove()

			},
			
			updateTodo(index){
				console.log(index)
				let updateRef = firebase.database().ref('/todos/' + this.uid +'/' + index)
				updateRef.update(this.todos[index])	
			}
		}
	}
)