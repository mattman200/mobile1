// JavaScript Document

		var objCursor = null;
	
			var objKeyRange = null;
			var read_id = Number(document.getElementById("txtEditID").value);
					
			//Get the values from User
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
			
			
			//var store = trans.objectStore('your-store-name');
			//var req = store.put(value, key); 

			//var objRequest = store.put(data);								
	
	  		//do the update
	  		//var objRequest = store.put(data);
			
			//open a read-write transaction
			var transaction = db.transaction(ObjectStoreName,"readwrite");
			var objStore = transaction.objectStore(ObjectStoreName);
			
			//create a range from the key
			objKeyRange = IDBKeyRange.only(read_id)
				console.log("Key   " + 	objKeyRange);
			//open a cursor of only the record to update
			objCursor = objStore.openCursor(objKeyRange);
			
			
	
			//ONSUCCESS
			objCursor.onsuccess = function(evt){
				console.log("HERE");
					var cursor = evt.target.result;
					console.log("cursor   " + 	evt.target.result);
					//=====
					//.add({ Fname: get_Fname, Lname: get_Lname, nickname: get_nickname,  tel_H: get_tel_H, tel_M: get_tel_M, dob: get_dob, email: get_email, group: get_group });
		
					//do the update
					//var objRequest = cursor.update({Fname: get_Fname, Lname: get_Lname, nickname: get_nickname,  tel_H: get_tel_H, tel_M: get_tel_M, dob: get_dob, email: get_email, group: get_group });

					//var objRequest = cursor.put({Fname: 'get_Fname', Lname: 'get_Lname', nickname: 'get_nickname',  tel_H: 'get_tel_H', tel_M: 'get_tel_M', dob: 'get_dob', email: 'get_email', group: 'get_group' });
					var objRequest = cursor.put({Fname: "get_Fname", Lname: "get_Lname", nickname: "get_nickname",  tel_H: "get_tel_H", tel_M: "get_tel_M", dob: "get_dob", email: "get_email", group: "get_group" });
					//var objRequest = cursor.update({Fname: get_Fname, Lname: get_Lname, nickname: get_nickname,  tel_H: get_tel_H, tel_M: get_tel_M, dob: get_dob, email: get_email, group: get_group });
							  
					//ONSUCCESS
					objRequest.onsuccess = function(ev){
							console.log('Success in updating record');
					};
					//ONERROR
					objRequest.onerror = function(ev){
							console.log('Error in updating record' + txtEditID);
					};
			};
			
			//ONERROR
			objCursor.onerror = function(evt){
					console.log('Error in retrieving record 88' + txtEditID);
			};  