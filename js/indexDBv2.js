	
	//Mobile Application to hold Persontal Contacts
	//Used for Bradfield Senior College Assignment
	//Created by: Peter Cox -  PCSquared
	//Created on: Saturday 3rg August 2013 

	
	//SET VARIABLES
	var localDatabase = {};	   //NAMESPACE  use for our database
	var databaseName = "ContactDB";  //Database  Name	
	var version = 2;  // database version
	var DB = null;  // This will hold the instance of our databse when it is generated
	//OBJECT STORE
	var ObjectStoreName = "MyContacts";
	var ObjectStoreKeyPathName = "id";

	 //initial data to populate 
	const contactsData = [
	  { Fname: "Santa", Lname: "Clause",  nickname: "santa", tel_H: "1234567", tel_M: "040123456",  dob: "1/01/1950", email: "santa@northpole.com" , group: "VIP"},
	  { Fname: "Easter", Lname: "Bunny",  nickname: "bunny", tel_H: "654321", tel_M: "040654321",  dob: "2/02/1979", email: "bunny@easterisland.org" , group: "VIP"}
	];	
	//http://www.onlywebpro.com/2012/12/23/html5-storage-indexeddb/
	
//---------------- TESTING FOR indexedDB----------------------------------------------------------------//
	//The root object for IndexedDB API is called indexedDB.  
	//BUT current implementations of IndexedDB hide under different browser prefixes- so we test them here
	localDatabase.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
	//Also references to some window.IDB* objects:IDBKeyRange and IDBTransaction should be tested as well
	localDatabase.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange;
	localDatabase.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction;
	
	console.log('opening local database');
	
	//Here CHECK for the presence of this IndexedDB OBJECT to see whether the current browser supports IndexedDB or not. 
	if (!localDatabase.indexedDB) {
		window.alert("Your browser doesn't support a stable version of IndexedDB.")
	}
//----------------end - TESTING FOR indexedDB-----------------------------------------------------------
 
 
//---------------- OPEN DATABASE-------------------------------------------------------------------------//
	// Here we make an asynchronous API (REQUEST) to Open our Database Using the OPEN method
	// Paremeter: 1. Database Name 2. Database Version number
	var request = localDatabase.indexedDB.open(databaseName,version);
	
	//Our CALL will RETURN a reference to a "REQUEST" object
	//which exposes two HANDLER events: ON-SUCCESS and ONERROR.	
	
	// ONERROR
	request.onerror = function(event) {
			console.log("Request Error: newBD: " + event.target.errorCode);
	};
	
	// ONSUCCESS
	request.onsuccess = function(event) {
			//REQUEST here was generated with a call to indexedDB.open(), so request.result is an INSTANCE of IDBDatabase,
			//set DB as instnce of IDBDatabase
			DB = request.result;
			
			console.log("Opens DB - success: "+ " ---- " +  DB + "---"  + DB.version);
	};
	 
	// Check if opened in other TAB
	request.onblocked = function(event) {
			// If some other tab is loaded with the database, then it needs to be closed
			// before we can proceed.
			alert("Please close all other tabs with this site open!");
	};	
	
//----------------end OPEN DATABASE--------------------------------------------------------------//
	
	 
//---------------- IF DATABSE DOES NOT EXIST?-----------------------------------------------------//
	//When the database did not previously exist, an onupgradeneeded event is triggered.
	//The onupgradeneeded callback is the only place in our code that we can alter the structure of the database.
	//In the handler for this event, you should create the reate object stores and indexes needed for this version of the database:
	
	//To update the database, or to create, delete or modify the database, 
	//then you have to implement the onupgradeneeded handler or which will be called as 
	//part of a versionchange transaction that allows you to make any changes on the database. 
	
	request.onupgradeneeded = function(event) {
			//event.request.result is an INSTANCE of IDBDatabase
			//set DB as instnce of IDBDatabase
			var DB = event.target.result;
			//checks if there is an older version of the datbase
			if(event.oldVersion < 10){
				console.log("OLD VERSION "  + event.oldVersion);
			}
			//if (DB.version !== self.version) {
			//	 console.log("NOT THE SAME VERSION"  + event.oldVersion); 
			//}
	
			console.log(" onupgradeneeded " + DB);
			//---------CRETAE AN OBJECT STORE -----------------------------//
			//To create an OBJECT STORE we use the createObjectStore() METHOD. 
			//This method accepts 2 parameters: 
			// - name of the store :  I have named this Object Store "Contacts"
			// - parameter object : a key path  (optionally have a key generator)
			//    * keyPath that is the property that makes an individual object in the store unique 
			//Explaination
			//KEY: A data value by which stored values are organized and retrieved in the object store.
			//KEY: Each record in the object store is uniquely identified by a “key.” 
			//Here, I have use the “id” as keyPath, which is unique value in the object store, 
			//We must make sure that the “id” property must be present in every objects in the object store.
			var objectStore = DB.createObjectStore(ObjectStoreName, {keyPath: ObjectStoreKeyPathName, autoIncrement: true });
			//What is an Object Store?
			//The mechanism by which data is stored in the database. 
			//The object store persistently holds records, which are key-value pairs. 
			//Records within an object store are sorted according to the keys in an ascending order.
			objectStore.createIndex('Fname', 'Fname', { unique: false });
			objectStore.createIndex('Lname', 'Lname', { unique: false });
			objectStore.createIndex('nickname', 'nickname', { unique: false });	
			objectStore.createIndex('tel_H', 'tel_H', { unique: false });
			objectStore.createIndex('tel_M', 'tel_M', { unique: false });
			objectStore.createIndex('email', 'email', { unique: false });
			objectStore.createIndex('dob', 'dob', { unique: false });
			objectStore.createIndex('group', 'group', { unique: false });		
				
				//populate DB
				for (var i in contactsData) {
					console.log("adding");
						objectStore.add(contactsData[i]);       
				}
	}
	
//----------------END - IF DATABSE DOES NOT EXIST?-----------------------------------------------------//
	//    |
	//    |
	//    |
	//    |
	//    |
	//    |
	//    |
//------------------------------FUNCTIONS for our Mobile Application-------------------------------------------------//
	
	
	//-----------------FUNCTIONS:  SEARCH BY INDEX-------------------------------------------------------------------//
	function searchC() {
			//GET SEARCH ID
			var read_id = Number(document.getElementById("txtReadID").value);
			//get tranaction to Contact Store
			var transaction = DB.transaction(ObjectStoreName,"readonly");
			var objectStore = transaction.objectStore(ObjectStoreName);
			var request = objectStore.get(read_id);
			//ONERROR
			request.onerror = function(event) {
			  	alert("Unable to retrieve daa from database!");
			};
			//ONSUCCESS
			request.onsuccess = function(event) {
				document.getElementById("output").innerHTML = "request.onsuccess: " + request.result;
				// Do something with the request.result!
				if(request.result) {
						document.getElementById("output").innerHTML ="ID: " + request.result.id + " Name: " + request.result.Fname + " DOB:   " + request.result.dob + "   Email: " + request.result.email;
				} else {
						document.getElementById("output").innerHTML ="ID couldn't be found in your database!";  
				}
			};
	}
	//-----------------end- SEARCH -----------------------------------------------------------------------------------//
	//    |
	//    |
	//    |
	//    |
	//    |
	//    |
	//    |
	//-----------------FUNCTIONS:  SEARCH by NICKNAME  ------------------------------------------------------------------------------//
	function searchNickname() {
			//get search value
			var read_id = document.getElementById("txtReadID").value;
			// Create transaction
			var transaction = DB.transaction(ObjectStoreName,"readonly");
			var objStore = transaction.objectStore(ObjectStoreName);
			
			// get index for field
			var index = objStore.index("nickname");
			//ONSUCCESS
			//Use index gets method to read field VLAUE
			index.get(read_id).onsuccess = function(event) {
			  document.getElementById("output").innerHTML = ("FOUND: Nickname  " + event.target.result.nickname + " Name "  +  event.target.result.Fname + "   " + event.target.result.Lname   );
			};
			//ONERROR
			index.get(read_id).onerror = function(event) {
			  document.getElementById("output").innerHTML = ("NOT FOUND in Database" );
			};
			//NOTE:  If there is mre than one nickname the same  you always get the one with the lowest key value.
			//If you want to get ALL nicknames the same USE  either:
			//- index.openCursor()
			//- index.openKeyCursor
	}
	//-----------------end -  SEARCH by NICKNAME -------------------------------------------------------------------//
	//    |
	//    |
	//    |
	//    |
	//    |
	//    |
	//    |
	//-----------------FUNCTIONS:  ADD  ------------------------------------------------------------------------------//
	function add() {
			//get filed values from Form
			var get_Fname = document.getElementById("txt_Fname").value;
			var get_Lname = document.getElementById("txt_Lname").value;	
			var get_nickname = document.getElementById("txt_nickname").value;	
			var get_tel_H = document.getElementById("txt_tel_H").value;	
			var get_tel_M = document.getElementById("txt_tel_M").value;	
			var get_dob = document.getElementById("txt_dob").value;
			var get_email = document.getElementById("txt_email").value;
			//NOTE: uses getElementsByName   (by NAME not ID)
			var radioButtons = document.getElementsByName("txt_group");
			for (var i = 0; i < radioButtons.length; i++) {
				if (radioButtons[i].checked) {
					var get_group = radioButtons[i].value ;
				}
			}
			//open connection to database using TRANSACTION
			var request = DB.transaction([ObjectStoreName],"readwrite")
					.objectStore(ObjectStoreName)
					.add({ Fname: get_Fname, Lname: get_Lname, nickname: get_nickname,  tel_H: get_tel_H, tel_M: get_tel_M, dob: get_dob, email: get_email, group: get_group });
			   
			//ONSUCCESS					
			request.onsuccess = function(event) {
				  document.getElementById("output").innerHTML = "Data Entered:  " + " Name: " + get_Fname +  " DOB: " + get_dob + " Email: " + get_email ;
			};
			//ONERROR
			request.onerror = function(event) {
					document.getElementById("output").innerHTML =" Unable to add data\r\nKenny is aready exist in your database! ";        
			}
			 
	}
	//-----------------end -  ADD -------------------------------------------------------------------//
	//    |
	//    |
	//    |
	//    |
	//    |
	//    |
	//    |
	//-----------------FUNCTIONS:  READALL ------------------------------------------------------------------------------//	
	function readAll() {
			//open connection to database using TRANSACTION
		  	var transaction = DB.transaction(ObjectStoreName,"readonly");
			//once connection is OPEN - connect to ObjectStore
			var objectStore = transaction.objectStore(ObjectStoreName);
			
			var contactsData = [];
			var contactsDataLINK = [];
			document.getElementById('output').innerHTML = "";
			
			objectStore.openCursor().onsuccess = function(event) {
			  
			 var cursor = event.target.result;
			 // document.getElementById("output").innerHTML = "DUDE";
			  document.getElementById("listview").innerHTML = "";
					if (cursor) {
							contactsData.push("Key " + cursor.key + " <br> First Name:   "  + cursor.value.Fname + " <br>Last Name:   "  + cursor.value.Lname + "<br> Nickame:   "  + cursor.value.nickname + "<br> Tel(H): " + cursor.value.tel_H + "<br> Tel(M): " + cursor.value.tel_M +"<br> DOB: " + cursor.value.dob  +"<br> Email: " + cursor.value.email  +"<br>Group: " + cursor.value.group   +" <br> <br> " );
							contactsDataLINK.push(cursor.key);
							//document.getElementById("output").innerHTML += JSON.stringify(cursor.value) + "<br>" ;
							//document.getElementById("output").innerHTML += "<li>" +"Key " + cursor.key + " <br> First Name:   "  + cursor.value.Fname + " <br>Last Name:   "  + cursor.value.Lname + "<br> Nickame:   "  + cursor.value.nickname + "<br> Tel(H): " + cursor.value.tel_H + "<br> Tel(M): " + cursor.value.tel_M +"<br> DOB: " + cursor.value.dob  +"<br> Email: " + cursor.value.email  +"<br>Group: " + cursor.value.group + "</li>"  ;
							cursor.continue();
							
					}
					else {
							document.getElementById("listview").textContent += "No more entries!";
					}
					
					document.getElementById("listview").innerHTML = "";
										   
					 //DISPLAY RECORDS  
					var parent = document.getElementById('listview');
							for (var count = 0; count < contactsData.length; count++) {
								var listItem = document.createElement('li');
								listItem.setAttribute('id','listitem');
								listItem.innerHTML = "<a href='editContact.html'> " + contactsData[count] + "</a>";
								parent.appendChild(listItem);
							}
					parent.appendChild(listItem);
				   
				   // Refreshes List
					var list = document.getElementById('listview');
					$(list).listview("refresh");			   
					   
			};  // end onsuccess 
	}
	//-----------------end     READALL ------------------------------------------------------------------------------//	
	//    |
	//    |
	//    |
	//    |
	//    |
	//    |
	//    |
	//-----------------FUNCTIONS:  EDIT  - SEARCH ------------------------------------------------------------------------------//
	function editSearch() {
			// get id 
			var read_id = Number(document.getElementById("txtEditID").value);
	
			//create a port to ObjectStore
			var transaction = DB.transaction(ObjectStoreName,"readwrite");
			var objectStore = transaction.objectStore(ObjectStoreName);
			//get record using parameter  ID
			var request = objectStore.get(read_id);
			
			//ONERROR
			request.onerror = function(event) {
			  		alert("Unable to retrieve daa from database!");
			};
			//ONSUCCESS
			request.onsuccess = function(event) {
					document.getElementById("output").innerHTML = "request.onsuccess: " + request.result;
					// Do something with the request.result!
					if(request.result) {
							document.getElementById("output").innerHTML ="EditSearch - ID: " + request.result.id + " Name: " + request.result.Fname + ", Nickname: " + request.result.nickname + ", Email: " + request.result.email;
							
							document.getElementById("txt_Fname").value = request.result.Fname;
							document.getElementById("txt_Lname").value = request.result.Lname;
							document.getElementById("txt_nickname").value = request.result.nickname;	
							document.getElementById("txt_tel_H").value = request.result.get_tel_M;
							document.getElementById("txt_tel_M").value = request.result.get_tel_H;
							document.getElementById("txt_dob").value = request.result.dob;
							document.getElementById("txt_email").value = request.result.email;
		
							var radioButtons = document.getElementsByName("txt_group");
								
							for (var i = 0; i < radioButtons.length; i++) {
									  if (radioButtons[i].value == request.result.group) {
										  radioBut = document.getElementById(radioButtons[i].id);
										  radioBut.checked = true;
										  //After we manipulate a radio button via JavaScript,
										  // we must call the refresh method on it to update the visual styling 
										  $("input[type='radio']").attr("checked",true).checkboxradio("refresh");
									  }
							}
							
		
					} else {
						document.getElementById("output").innerHTML ="ID couldn't be found in your database!";  
					}
		 };
		 
		 	//radiobtn = document.getElementById("theid");
			//radiobtn.checked = true;
	}	
	//-----------------end EDIT  - SEARCH ------------------------------------------------------------------------------//
	//    |
	//    |
	//    |
	//    |
	//    |
	//    |
	//    |
	//-----------------FUNCTIONS:  EDIT  - UPDATE ------------------------------------------------------------------------------//
	function editUpDate() {
				// get id
				var read_id = Number(document.getElementById("txtEditID").value);
				// get all field values from FORM
				  var get_Fname = document.getElementById("txt_Fname").value;
				  var get_Lname = document.getElementById("txt_Lname").value;	
				  var get_nickname = document.getElementById("txt_nickname").value;	
				  var get_tel_H = document.getElementById("txt_tel_H").value;	
				  var get_tel_M = document.getElementById("txt_tel_M").value;	
				  var get_dob = document.getElementById("txt_dob").value;
				  var get_email = document.getElementById("txt_email").value;
				  //uses getElementsByName
				  var radioButtons = document.getElementsByName("txt_group");
				  for (var i = 0; i < radioButtons.length; i++) {
					  if (radioButtons[i].checked) {
						  var get_group = radioButtons[i].value ;
					  }
				  }
				  //PUT INTO DATABASE TABLE
				  //open a read-write transaction
				objTrans = DB.transaction([ObjectStoreName],"readwrite");
				//get the store
				objStore = objTrans.objectStore(ObjectStoreName);	
				//get record from store using ID
				req = objStore.get(read_id);
				
				req.onsuccess = function(evt){
							//put the record OBJECT into data variable
							var data = evt.target.result;
							// add updated record value to record
							data.Fname = get_Fname;
							data.Lname = get_Lname;
							data.nickname = get_nickname;
							data.tel_H = get_tel_H;
							data.tel_M = get_tel_M;
							data.dob = get_dob;
							data.email = get_email;
							data.group = get_group;
						//PUT record into store
						 var objRequest = objStore.put(data);  
						
						objRequest.onsuccess = function(ev){
							document.getElementById("output").innerHTML  = "----- Success in updated record--------<br>";
						};
						objRequest.onerror = function(ev){
							document.getElementById("output").innerHTML  = "Error in updating record";
						};
						req.onerror = function(evt){
							document.getElementById("output").innerHTML  ="Error in retrieving record";
						};		 
		        }
				//var list = document.getElementById('listview');
				//$(list).listview("refresh");		
	}    
	//-----------------end    EDIT  - UPDATE ------------------------------------------------------------------------------//
		
	
		
			 
	
	
	//-----------------FUNCTIONS: DELETE ------------------------------------------------------------------------------//
	function remove2() {
			var delete_id = Number(document.getElementById("txtDeleteID").value);
			var request = DB.transaction(ObjectStoreName, "readwrite")
					.objectStore(ObjectStoreName)
					.delete(delete_id);
			request.onsuccess = function(event) {
			  document.getElementById("output").innerHTML ="entry has been removed from your database.";
			};
	}
	 
	//-----------------end  DELETE ------------------------------------------------------------------------------//
	
