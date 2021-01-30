var app = angular.module('app', ['ngRoute']);

angular.module('app').directive('appFilereader', function($q) {
	var slice = Array.prototype.slice;

	return {
		restrict: 'A',
		require: '?ngModel',
		link: function(scope, element, attrs, ngModel) {
			if (!ngModel) return;

			ngModel.$render = function() {};

			element.bind('change', function(e) {
				var element = e.target;

				$q.all(slice.call(element.files, 0).map(readFile))
					.then(function(values) {
						if (element.multiple) ngModel.$setViewValue(values);
						else ngModel.$setViewValue(values.length ? values[0] : null);
					});

				function readFile(file) {
					var deferred = $q.defer();

					var reader = new FileReader();
					reader.onload = function(e) {
						deferred.resolve(e.target.result);
					};
					reader.onerror = function(e) {
						deferred.reject(e);
					};
					reader.readAsDataURL(file);

					return deferred.promise;
				}

			});

		}
	};
});

app.factory('registrierenService', ['$http', function ($http){
		function registrierenTeilnehmer(teilnehmer){
			return $http.post('/teilnehmer/registration/add', teilnehmer)
		}
		function registrierenVeranstalter(veranstalter){
			return $http.post('/veranstalter/registration/add', veranstalter)
		}
		function registrierenManagement(management){
			return $http.post('/management/registration/add', management)
		}
		return {registrierenTeilnehmer, registrierenVeranstalter, registrierenManagement};
	}])

	.factory('loginService', ['$http', function ($http){
		function loginTeilnehmer(daten){
			return $http.post('/teilnehmer/login', daten)
		}
		function loginVeranstalter(daten){
			return $http.post('/veranstalter/login', daten)
		}
		function loginManagement(daten){
			return $http.post('/management/login', daten)
		}
		function loginAdmin(daten){
			return $http.post('/admin/login', daten)
		}
		function passwortAnfragen(daten){
			return $http.put('/passwort', daten)
		}
		return {loginTeilnehmer, loginVeranstalter, loginManagement, loginAdmin, passwortAnfragen};
	}])

	.factory('logoutService', ['$http', function ($http){
		function logoutTeilnehmer(token){
			return $http.delete('/teilnehmer/logout/'+ token)
		}
		function logoutVeranstalter(token){
			return $http.delete('/veranstalter/logout/' + token)
		}
		function logoutManagement(token){
			return $http.delete('/management/logout/' + token)
		}
		function logoutAdmin(token){
			return $http.delete('/admin/logout/' + token)
		}
		return {logoutTeilnehmer, logoutVeranstalter, logoutManagement, logoutAdmin};
	}])

	.factory('teilnehmerService', ['$http', function ($http){
		function getTeilnehmer(userID){
			return $http.get('/teilnehmer/showOne/'+ userID)
		}

		function getTeilnehmers(){
			return $http.get('/teilnehmer/show')
		}

		function participate(userID, veranstaltung){
			return $http.put('/teilnehmer/participate/' + userID + '/' + veranstaltung)
		}

		function deregisterEvent(userID, veranstaltung){
			return $http.put('/teilnehmer/deregisterEvent/' + userID + '/' + veranstaltung)
		}

		function editTeilnehmer(userID, user){
			return	$http.put('/teilnehmer/edit/'+userID, user)
		}

		function deleteTeilnehmer(userID){
			return $http.delete('/teilnehmer/delete/'+userID)
		}
		return {getTeilnehmer, getTeilnehmers, participate, deregisterEvent, editTeilnehmer, deleteTeilnehmer};

	}])

	.factory('veranstalterService', ['$http', function ($http){
		function getVeranstalter(userID){
			return $http.get('/veranstalter/showOne/'+ userID)
		}
		function getVeranstalters(){
			return $http.get('/veranstalter/show')
		}
		function editVeranstalter(userID, user){
			return	$http.put('/veranstalter/edit/'+userID, user)
		}
		function deleteVeranstalter(userID){
			return $http.delete('/veranstalter/delete/'+ userID)
		}
		function request(userID, daten){
			return $http.post('/veranstalter/request/'+ userID, daten)
		}
		function stornoVeranstaltung(veranstaltungID){
			return $http.delete('/veranstalter/storno/'+veranstaltungID)
		}
		return {getVeranstalter, getVeranstalters, editVeranstalter, deleteVeranstalter, request, stornoVeranstaltung};
	}])

	.factory('managementService', ['$http', function ($http){
		function getManagement(userID){
			return $http.get('/management/showOne/'+ userID)
		}
		function getManagements(){
			return $http.get('/management/show')
		}
		function editManagement(userID, user){
			return	$http.put('/management/edit/'+userID, user)
		}
		function deleteManagement(userID){
			return $http.delete('/management/delete/'+userID)
		}
		return {getManagement, getManagements, editManagement, deleteManagement};
	}])

	.factory('adminService', ['$http', function ($http){
		function getAdmin(userID){
			return $http.get('/admin/showOne/'+ userID)
		}
		return {getAdmin};
	}])

	.factory('veranstaltungService', ['$http', function ($http){
		function createVeranstaltung(veranstaltung){
			return $http.post('/veranstaltung/add', veranstaltung)
		}
		function getVeranstaltungen(){
			return $http.get('/veranstaltung/show')
		}

		function getVeranstaltung(veranstaltungID){
			return $http.get('/veranstaltung/showOne/'+veranstaltungID)
		}

		function showTeilnehmer(veranstaltungID){
			return $http.get('/veranstaltung/showOne/list/'+veranstaltungID)
		}

		function downloadListe(veranstaltungID){
			return $http.post('/veranstaltung/download/'+veranstaltungID)
		}

		function editListe(veranstaltungID, teilnehmerListe){
			return $http.put('/veranstaltung/teilnehmerListe/edit/'+veranstaltungID, teilnehmerListe)
		}

		function editVeranstaltung(veranstaltungID, veranstaltung){
			return	$http.put('/veranstaltung/edit/'+veranstaltungID, veranstaltung)
		}

		function showTeilnehmerListe(veranstaltungID){
			return $http.get('/veranstaltung/teilnehmerListe/show/'+veranstaltungID)
		}

		function accountVeranstaltung(veranstaltungID){
			return $http.put('/veranstaltung/abrechnen/'+veranstaltungID)
		}

		function deleteVeranstaltung(veranstaltungID){
			return $http.delete('/veranstaltung/delete/'+veranstaltungID)
		}

		function cancelVeranstaltung(veranstaltungID, daten){
			return $http.post('/veranstaltung/delete/message/'+veranstaltungID, daten)
		}
		return {createVeranstaltung, getVeranstaltungen, getVeranstaltung, showTeilnehmer, downloadListe, editListe, showTeilnehmerListe, editVeranstaltung, accountVeranstaltung, deleteVeranstaltung, cancelVeranstaltung}
    
	}])

	.factory('raumService', ['$http', function ($http){
		function createRaum(raum){
			return $http.post('/raum/add', raum)
		}

		function getRaeume(){
			return $http.get('/raum/show')
		}

		function getRaum(raumID){
			return $http.get('/raum/showOne/'+raumID)
		}

		function editRaum(raumID, raum){
			return	$http.put('/raum/edit/'+raumID, raum)
		}

		function deleteRaum(raumID){
			return $http.delete('/raum/delete/'+raumID)
		}

		function checkAvailability(raumID, datum){
			return $http.post('/raum/verfuegbarkeit/'+raumID, datum)
		}
		return {createRaum, getRaeume, getRaum, editRaum, deleteRaum, checkAvailability}
	}])
	.factory('statistikService', ['$http', function($http){
		function raumAuslastung(){
			return $http.post('/statistik/raumauslastung')
		}

		function veranstaltungAuslastung(veranstaltungID){
			return $http.post('/statistik/veranstaltungAuslastung/'+veranstaltungID)
		}
		return {raumAuslastung, veranstaltungAuslastung}
	}])

	.factory('tokenService', [ function (){
		function getToken(){
			return localStorage.getItem('token_id');
		}

		function getID(){
			return localStorage.getItem('user_id');
		}
		return{getToken, getID}
	}])

	.factory('authService',['$http', function($http){
		function checkToken(token){
			return $http.get('/auth/check/' +token)
		}
		return {checkToken}
	}])

app.controller('loginController', ['$scope', 'registrierenService', 'loginService', function ($scope, registrierenService, loginService){
	console.log('Login Controller is running');

	function erstelleTeilnehmer(teilnehmer){
		$scope.teilnehmer={};
		registrierenService.registrierenTeilnehmer(teilnehmer).then(function (res){
			localStorage.setItem('user_id', res.data.userID);
			localStorage.setItem('token_id', res.data.token);
			location.href = '/#!/event-search-participant'
			alert(res.data.message);
		},
			function(err) {
				console.log(err.data.message);
				err.data.errors.forEach(error => alert(error.message))
			})
	}

	function erstelleVeranstalter(veranstalter){
		$scope.veranstalter={};
		registrierenService.registrierenVeranstalter(veranstalter).then(function (res){
			localStorage.setItem('user_id', res.data.userID);
			localStorage.setItem('token_id', res.data.token);
			location.href = '/#!/event-overview-host'

		},
			function(err) {
				console.log(err.data.message);
				err.data.errors.forEach(error => alert(error.message))
			})
	}

	function loggeTeilnehmer(daten){
		$scope.daten={};
		loginService.loginTeilnehmer(daten).then(
			function (res) {
				localStorage.setItem('user_id', res.data.userID);
				localStorage.setItem('token_id', res.data.token);
				location.href = '/#!/event-search-participant'
			},
			function(err) {
				console.log(err.data.message);
				alert(err.data.message);
			})
	}

	function loggeVeranstalter(daten){
		$scope.daten={};
		loginService.loginVeranstalter(daten).then(
			function (res){
				localStorage.setItem('user_id', res.data.userID);
				localStorage.setItem('token_id', res.data.token);
				location.href = '/#!/event-overview-host'
			},
			function(err) {
				console.log(err.data.message);
				alert(err.data.message);
			})
	}

	function loggeManagement(daten){
		$scope.daten={};
		loginService.loginManagement(daten).then(function (res){
			localStorage.setItem('user_id', res.data.userID);
			localStorage.setItem('token_id', res.data.token);
			location.href = '/#!/event-overview-management'
		},
			function(err) {
				console.log(err.data.message);
				alert(err.data.message);
			})
	}

	function loggeAdmin(daten){
		$scope.daten={};
		loginService.loginAdmin(daten).then(function (res){
			localStorage.setItem('user_id', res.data.userID);
			localStorage.setItem('token_id', res.data.token);
			location.href = '/#!/event-overview-admin'
		},
			function(err) {
				console.log(err.data.message);
				alert(err.data.message);
			})
	}

	function passwortAnfragen(daten){
		$scope.daten={};
		loginService.passwortAnfragen(daten).then(function(res){
			alert(res.data.message);
		},
		function(err){
			alert(err.data.message);
		})
	}

	$scope.erstelleTeilnehmer = (teilnehmer) => erstelleTeilnehmer(teilnehmer);
	$scope.erstelleVeranstalter = (veranstalter) => erstelleVeranstalter(veranstalter);
	$scope.loggeTeilnehmer = (daten) => loggeTeilnehmer(daten);
	$scope.loggeVeranstalter = (daten) => loggeVeranstalter(daten);
	$scope.loggeManagement = (daten) => loggeManagement(daten);
	$scope.loggeAdmin = (daten) => loggeAdmin(daten);
	$scope.passwortAnfragen = (daten) => passwortAnfragen(daten);

}])

	.controller('teilnehmerController', ['$scope', '$routeParams','tokenService','authService', 'teilnehmerService','veranstaltungService','logoutService', 'statistikService',  function($scope, $routeParams, tokenService, authService, teilnehmerService, veranstaltungService, logoutService, statistikService){
		console.log('Teilnehmer Controller');

		setTimeout(function () {
			authService.checkToken(tokenService.getToken()).then(function (res){
				let bool = res.data;
				console.log(bool.boolean)
				if( bool.boolean === 'false') {
				location.href = '/#!/login'
			}
			});
		}, 50);

    	var paramID = $routeParams.id;

		//filter
		teilnehmerService.getTeilnehmer(tokenService.getID()).then(res => $scope.teilnehmerID = res.data._id);


		veranstaltungService.getVeranstaltungen().then(res=>$scope.veranstaltungen = res.data);

		teilnehmerService.getTeilnehmer(tokenService.getID()).then(res => $scope.teilnehmer = res.data);


		function teilnehmen(veranstaltung){
			teilnehmerService.participate(tokenService.getID(), veranstaltung).then(
				function(res){
					alert(res.data.message);
				},
				function(err){
					alert(err.data.message);
				}
			);
		}
		function abmelden(veranstaltung){
			teilnehmerService.deregisterEvent(tokenService.getID(), veranstaltung).then(
				function(res){
					alert(res.data.message);
				},
				function(err){
					alert(err.data.message);
				}
			);
		}
		function updateTeilnehmer(neuerTeilnehmer){
			$scope.neuerTeilnehmer = {};
			console.log(neuerTeilnehmer);
			teilnehmerService.editTeilnehmer(paramID ,neuerTeilnehmer).then(
				function(res){
					alert(res.data.message);
					location.href = '/#!/profile-participant'
				},
				function(err){
					alert(err.data.message);
				}
			);
		}
    	function loescheTeilnehmer(){
			teilnehmerService.deleteTeilnehmer(paramID).then(
				function(res){
					alert(res.data.message);
				},
				function(err){
					alert(err.data.message);
				}
			);
		}
		function loggeOut(){
			logoutService.logoutTeilnehmer(tokenService.getToken()).then(
				function(res){
					localStorage.clear()
					alert(res.data.message);
				},
				function(err){
					alert(err.data.message);
				}
			);
		}
		/*function auslastung(veranstaltungID){
			statistikService.veranstaltungAuslastung(veranstaltungID).then(
				function(res){
					alert(res.data.message);
				},
				function(err){
					alert(err.data.message);
				}
			);
		}*/

		$scope.teilnehmen = (veranstaltung) => teilnehmen(veranstaltung);
		$scope.abmelden = (veranstaltung) => abmelden(veranstaltung);
		$scope.updateTeilnehmer = (neuerTeilnehmer) => updateTeilnehmer(neuerTeilnehmer);
    	$scope.loescheTeilnehmer = () => loescheTeilnehmer();
		$scope.loggeOut = () => loggeOut();
		$scope.currentDate = new Date();
		//$scope.auslastung = (veranstaltungID) => auslastung(veranstaltungID).then(res => $scope.anzeige = res);

	}])

	.controller('veranstalterController', ['$scope', '$routeParams', 'tokenService', 'authService', 'veranstalterService', 'veranstaltungService', 'logoutService', function ($scope, $routeParams, tokenService, authService, veranstalterService, veranstaltungService, logoutService){
		console.log('Veranstalter Controller');

		setTimeout(function () {
			authService.checkToken(tokenService.getToken()).then(function (res){
				let bool = res.data;
				console.log(bool.boolean)
				if( bool.boolean === 'false') {
					location.href = '/#!/login'
				}
			});
		}, 500);

		var paramID = $routeParams.id;
		$scope.currentDate = new Date();

		//filter
		veranstalterService.getVeranstalter(tokenService.getID()).then(res => $scope.emailVeranstalter = res.data.email);

		veranstalterService.getVeranstalter(tokenService.getID()).then(res => $scope.veranstalter = res.data);
		veranstaltungService.getVeranstaltung(paramID).then(res=> $scope.veranstaltung = res.data);
		veranstaltungService.getVeranstaltungen().then(res=>$scope.veranstaltungen = res.data);

		veranstaltungService.showTeilnehmer(paramID).then(res => $scope.teilnehmers = res.data.teilnehmer);


		function anfragen(daten){
			console.log(daten)
			console.log('test ' + daten.teilnehmerListe)
			veranstalterService.request(tokenService.getID(), daten).then(
				function(res){
					alert(res.data.message);
				},
				function(err){
					err.data.errors.forEach(error => alert(error.message))
				}
			);
		}
		function downloadeListe(){
			veranstaltungService.downloadListe(paramID).then(
				function(res){
					let binaryPdf = atob(res.data);
					console.log(binaryPdf)
					const len = binaryPdf.length;
					const buffer = new ArrayBuffer(len);
					const view = new Uint8Array(buffer);
					for (let i = 0; i < len; i += 1) {
						view[i] = binaryPdf.charCodeAt(i);
					}
					const blob = new Blob([view], { type: 'application/pdf' });
					window.open(window.URL.createObjectURL(blob));
				},
				function(err){
					alert(err.data.message);
				}
			);
		}
		function updateListe(neueListe, veranstaltungID){
			$scope.neueListe = {};
			veranstaltungService.editListe(veranstaltungID, neueListe).then(
				function(res){
					alert(res.data.message);
				},
				function(err){
					alert(err.data.message);
				}
			);
		}

		function zeigeTeilnehmerListe(veranstalterID){
			veranstaltungService.showTeilnehmerListe(veranstalterID).then(function (res){
				console.log(res.data)
				let binaryPdf = atob(res.data);
				const len = binaryPdf.length;
				const buffer = new ArrayBuffer(len);
				const view = new Uint8Array(buffer);
				for (let i = 0; i < len; i += 1) {
					view[i] = binaryPdf.charCodeAt(i);
				}
				const blob = new Blob([view], { type: 'application/pdf' });
				window.open(window.URL.createObjectURL(blob));
			})
		}

		function updateVeranstalter(neuerVeranstalter){
			$scope.neuerVeranstalter = {};
			veranstalterService.editVeranstalter(paramID ,neuerVeranstalter).then(
				function(res){
					alert(res.data.message);
					location.href = '/#!/profile-host'
				},
				function(err){
					alert(err.data.message);
				}
			);
		}
		function loescheVeranstalter(){
			veranstalterService.deleteVeranstalter(paramID).then(
				function(res){
					alert(res.data.message);
				},
				function(err){
					alert(err.data.message);
				}
			);
		}
		function storniereVeranstaltung(veranstaltung){
			veranstalterService.stornoVeranstaltung(veranstaltung).then(
				function(res){
					alert(res.data.message);
				},
				function(err){
					alert(err.data.message);
				}
			);
		}
		function loggeOut(){
			logoutService.logoutVeranstalter(tokenService.getToken()).then(
				function(res){
					localStorage.clear()
					alert(res.data.message);
				},
				function(err){
					alert(err.data.message);
				}
			);
		}

		$scope.anfragen = (daten) => anfragen(daten);
		$scope.updateVeranstalter = (neuerVeranstalter) => updateVeranstalter(neuerVeranstalter);
		$scope.loescheVeranstalter = () => loescheVeranstalter();
		$scope.storniereVeranstaltung = (veranstaltung) => storniereVeranstaltung(veranstaltung);
		$scope.loggeOut = () => loggeOut();
		$scope.downloadeListe = () => downloadeListe();
		$scope.updateListe = (neueListe, veranstaltungID) => updateListe(neueListe, veranstaltungID);
		$scope.zeigeTeilnehmerListe = (veranstalterID) => zeigeTeilnehmerListe(veranstalterID);

	}])

	.controller('managementController', ['$scope','$routeParams', 'tokenService','authService', 'teilnehmerService', 'veranstalterService', 'managementService', 'veranstaltungService', 'raumService', 'logoutService', 'statistikService', function($scope, $routeParams, tokenService, authService, teilnehmerService, veranstalterService, managementService, veranstaltungService, raumService, logoutService, statistikService){
		console.log('Management Controller');

		setTimeout(function () {
			authService.checkToken(tokenService.getToken()).then(function (res){
				let bool = res.data;
				console.log(bool.boolean)
				if( bool.boolean === 'false') {
					location.href = '/#!/login'
				}
			});
		}, 500);

		var paramID = $routeParams.id;

		managementService.getManagement(tokenService.getID()).then(res => $scope.emailManagement = res.data.email);
		managementService.getManagement(tokenService.getID()).then(res => $scope.management = res.data);

		function erstelleVeranstaltung(veranstaltung){
			$scope.daten={};
			console.log(veranstaltung)
			veranstaltungService.createVeranstaltung(veranstaltung).then(
				function(res){
					alert(res.data.message);
				},
				function(err){
					err.data.errors.forEach(error => alert(error.message))
				}
			);
		}
		function erstelleRaum(raum){
			$scope.raum={};
			raumService.createRaum(raum).then(
				function(res){
					alert(res.data.message);
					location.href = '/#!/room-overview-management'
				},
				function(err){
					alert(err.data.message);
				}
			);
		}
		function updateRaum(neuerRaum){
			$scope.neuerRaum = {};
			console.log(neuerRaum);
			raumService.editRaum(paramID ,neuerRaum).then(
				function(res){
					alert(res.data.message);
				},
				function(err){
					alert(err.data.message);
				}
			);
		}
		function updateVeranstaltung(neueVeranstaltung){
			console.log(neueVeranstaltung)
			$scope.neueVeranstaltung={};
			veranstaltungService.editVeranstaltung(paramID, neueVeranstaltung).then(
				function(res){
					alert(res.data.message);
				},
				function(err){
					alert(err.data.message);
				}
			);
		}
		function abrechnenVeranstaltung(veranstaltung){
			veranstaltungService.accountVeranstaltung(veranstaltung).then(
				function(res){
					alert(res.data.message);
				},
				function(err){
					alert(err.data.message);
				}
			);
		}
		function loescheVeranstaltung(){
			veranstaltungService.deleteVeranstaltung(paramID).then(
				function(res){
					alert(res.data.message);
				},
				function(err){
					alert(err.data.message);
				}
			);
		}
		function loescheRaum(){
			raumService.deleteRaum(paramID).then(
				function(res){
					alert(res.data.message);
				},
				function(err){
					alert(err.data.message);
				}
			);
		}
		function updateVeranstalter(neuerVeranstalter){
			$scope.neuerVeranstalter = {};
			veranstalterService.editVeranstalter(paramID ,neuerVeranstalter).then(
				function(res){
					alert(res.data.message);
					location.href = '/#!/user-overview-management'
				},
				function(err){
					alert(err.data.message);
				}
			);
		}
		function loescheVeranstalter(){
			veranstalterService.deleteVeranstalter(paramID).then(
				function(res){
					alert(res.data.message);
				},
				function(err){
					alert(err.data.message);
				}
			);
		}
		function updateTeilnehmer(neuerTeilnehmer){
			$scope.neuerTeilnehmer = {};
			teilnehmerService.editTeilnehmer(paramID ,neuerTeilnehmer).then(
				function(res){
					alert(res.data.message);
					location.href = '/#!/user-overview-management'
				},
				function(err){
					alert(err.data.message);
				}
			);
		}
		function loescheTeilnehmer(){
			teilnehmerService.deleteTeilnehmer(paramID).then(
				function(res){
					alert(res.data.message);
				},
				function(err){
					alert(err.data.message);
				}
			);
		}
		function pruefeVerfuegbarkeit(datum){
			raumService.checkAvailability(paramID, datum).then(
				function(res){
					alert(res.data.message);
				},
				function(err){
					alert(err.data.message);
				}
			);
		}
		function loggeOut(){
			logoutService.logoutManagement(tokenService.getToken()).then(
				function(res){
					localStorage.clear()
					alert(res.data.message);
				},
				function(err){
					alert(err.data.message);
				}
			);
		}
		function absagen(daten){
			veranstaltungService.cancelVeranstaltung(paramID, daten).then(
				function(res){
					location.href = '/#!/event-overview-management'
					alert(res.data.message);
				},
				function(err){
					alert(err.data.message);
				}
			);
		}
		function downloadeListe(){
			veranstaltungService.downloadListe(paramID).then(
				function(res){
					let binaryPdf = atob(res.data);
					console.log(binaryPdf)
					const len = binaryPdf.length;
					const buffer = new ArrayBuffer(len);
					const view = new Uint8Array(buffer);
					for (let i = 0; i < len; i += 1) {
						view[i] = binaryPdf.charCodeAt(i);
					}
					const blob = new Blob([view], { type: 'application/pdf' });
					window.open(window.URL.createObjectURL(blob));
				},
				function(err){
					alert(err.data.message);
				}
			);
		}


		$scope.erstelleVeranstaltung = (veranstaltung) => erstelleVeranstaltung(veranstaltung);
		veranstaltungService.getVeranstaltungen().then(res=>$scope.veranstaltungen = res.data);
		$scope.veranstaltungen = [];
		$scope.param1 = paramID;

		veranstaltungService.showTeilnehmer(paramID).then(res => $scope.teilnehmerz = res.data.teilnehmer);
		veranstaltungService.getVeranstaltung(paramID).then(res=> $scope.veranstaltung = res.data);
		$scope.updateVeranstaltung = (neueVeranstaltung) => updateVeranstaltung(neueVeranstaltung);
		$scope.abrechnenVeranstaltung = (veranstaltung) => abrechnenVeranstaltung(veranstaltung);
		$scope.loescheVeranstaltung = () => loescheVeranstaltung();

		$scope.erstelleRaum = (raum) => erstelleRaum(raum);
		raumService.getRaeume().then(res=>$scope.raeume = res.data);
		$scope.raeume = [];
		raumService.getRaum(paramID).then(res=>$scope.raum = res.data);
		$scope.updateRaum = (neuerRaum) => updateRaum(neuerRaum);
		$scope.loescheRaum = () => loescheRaum();
		$scope.pruefeVerfuegbarkeit = (datum) => pruefeVerfuegbarkeit(datum);

		$scope.absagen = (daten) => absagen(daten);
		$scope.downloadeListe = () => downloadeListe();

		raumService.getRaeume().then(res => $scope.anzahlRaeume = res.data.length);
		veranstaltungService.getVeranstaltungen().then(res => $scope.anzahlVeranstaltungen = res.data.length);
		// Prozent wie viele Räume heute frei sind
		statistikService.raumAuslastung().then(res => $scope.raumAuslastung = res.data);

		$scope.updateVeranstalter = (neuerVeranstalter) => updateVeranstalter(neuerVeranstalter);
		$scope.loescheVeranstalter = () => loescheVeranstalter();
		veranstalterService.getVeranstalter(paramID).then(res=> $scope.veranstalter = res.data);
		veranstalterService.getVeranstalters().then(res=>$scope.veranstalters = res.data);
		$scope.veranstalters = [];

		$scope.updateTeilnehmer = (neuerTeilnehmer) => updateTeilnehmer(neuerTeilnehmer);
		$scope.loescheTeilnehmer = () => loescheTeilnehmer();
		teilnehmerService.getTeilnehmer(paramID).then(res=> $scope.teilnehmer = res.data);
		teilnehmerService.getTeilnehmers().then(res=>$scope.teilnehmers = res.data);
		$scope.teilnehmers = [];

		$scope.loggeOut = () => loggeOut();
		$scope.currentDate = new Date();

	}])

		.controller('adminController', ['$scope','$routeParams', 'tokenService', 'authService', 'teilnehmerService', 'veranstalterService', 'adminService', 'managementService', 'veranstaltungService', 'raumService', 'registrierenService','logoutService', 'statistikService', function($scope, $routeParams, tokenService, authService, teilnehmerService, veranstalterService, adminService, managementService, veranstaltungService, raumService, registrierenService, logoutService, statistikService){
		console.log('Admin Controller');

		setTimeout(function () {
			authService.checkToken(tokenService.getToken()).then(function (res){
				let bool = res.data;
				console.log(bool.boolean)
				if( bool.boolean === 'false') {
						location.href = '/#!/login'
				}
			});
			}, 500);

		var paramID = $routeParams.id;

		adminService.getAdmin(tokenService.getID()).then(res => $scope.emailAdmin = res.data.email);
		adminService.getAdmin(tokenService.getID()).then(res => $scope.admin = res.data);

		function erstelleManagement(management){
			$scope.management={};
			registrierenService.registrierenManagement(management).then(
				function(res){
					alert(res.data.message);
				},
				function(err){
					err.data.errors.forEach(error => alert(error.message))
				}
			);
		}

		function updateManagement(neuerManagement){
			$scope.neuerManagement = {};
			managementService.editManagement(paramID ,neuerManagement).then(
				function(res){
					alert(res.data.message);
					location.href = '/#!/user-overview-admin'
				},
				function(err){
					alert(err.data.message);
				}
			);
		}

		function loescheManagement() {
			managementService.deleteManagement(paramID).then(
				function(res){
					alert(res.data.message);
				},
				function(err){
					alert(err.data.message);
				}
			);
		}

		function erstelleVeranstaltung(veranstaltung){
			$scope.daten={};
			veranstaltungService.createVeranstaltung(veranstaltung).then(
				function(res){
					alert(res.data.message);
				},
				function(err){
					err.data.errors.forEach(error => alert(error.message))
				}
			);
		}

		function erstelleRaum(raum){
			$scope.raum={};
			raumService.createRaum(raum).then(
				function(res){
					alert(res.data.message);
					location.href = '/#!/room-overview-admin'
				},
				function(err){
					alert(err.data.message);
				}
			);
		}

		function updateRaum(neuerRaum){
			$scope.neuerRaum = {};
			console.log(neuerRaum);
			raumService.editRaum(paramID ,neuerRaum).then(
				function(res){
					alert(res.data.message);
				},
				function(err){
					alert(err.data.message);
				}
			);
		}

		function updateVeranstaltung(neueVeranstaltung){
			$scope.neueVeranstaltung={};
			veranstaltungService.editVeranstaltung(paramID, neueVeranstaltung).then(
				function(res){
					alert(res.data.message);
				},
				function(err){
					alert(err.data.message);
				}
			);
		}

		function abrechnenVeranstaltung(veranstaltung){
			veranstaltungService.accountVeranstaltung(veranstaltung).then(
				function(res){
					alert(res.data.message);
				},
				function(err){
					alert(err.data.message);
				}
			);
		}

		function loescheVeranstaltung(){
			veranstaltungService.deleteVeranstaltung(paramID).then(
				function(res){
					alert(res.data.message);
				},
				function(err){
					alert(err.data.message);
				}
			);
		}

		function loescheRaum(){
			raumService.deleteRaum(paramID).then(
				function(res){
					alert(res.data.message);
				},
				function(err){
					alert(err.data.message);
				}
			);
		}

		function updateVeranstalter(neuerVeranstalter){
			$scope.neuerVeranstalter = {};
			veranstalterService.editVeranstalter(paramID ,neuerVeranstalter).then(
				function(res){
					alert(res.data.message);
					location.href = '/#!/user-overview-admin'
				},
				function(err){
					alert(err.data.message);
				}
			);
		}

		function loescheVeranstalter(){
			veranstalterService.deleteVeranstalter(paramID).then(
				function(res){
					alert(res.data.message);
				},
				function(err){
					alert(err.data.message);
				}
			);
		}

		function updateTeilnehmer(neuerTeilnehmer){
			$scope.neuerTeilnehmer = {};
			teilnehmerService.editTeilnehmer(paramID ,neuerTeilnehmer).then(
				function(res){
					alert(res.data.message);
					location.href = '/#!/user-overview-admin'
				},
				function(err){
					alert(err.data.message);
				}
			);
		}

		function loescheTeilnehmer() {
			teilnehmerService.deleteTeilnehmer(paramID).then(
				function (res) {
					alert(res.data.message);
				},
				function (err) {
					alert(err.data.message);
				}
			);
		}

		function pruefeVerfuegbarkeit(datum){
			raumService.checkAvailability(paramID, datum).then(
				function(res){
					alert(res.data.message);
				},
				function(err){
					alert(err.data.message);
				}
			);
		}

		function loggeOut(){
			logoutService.logoutAdmin(tokenService.getToken()).then(
				function(res){
					localStorage.clear()
					alert(res.data.message);
					},
				function(err){
						alert(err.data.message);
				});
		}
		function absagen(daten){
			veranstaltungService.cancelVeranstaltung(paramID, daten).then(
				function(res){
					location.href = '/#!/event-overview-admin'
					alert(res.data.message);
				},
				function(err){
					alert(err.data.message);
				}
			);
		}
		function downloadeListe(){
			veranstaltungService.downloadListe(paramID).then(
				function(res){
					let binaryPdf = atob(res.data);
					console.log(binaryPdf)
					const len = binaryPdf.length;
					const buffer = new ArrayBuffer(len);
					const view = new Uint8Array(buffer);
					for (let i = 0; i < len; i += 1) {
						view[i] = binaryPdf.charCodeAt(i);
					}
					const blob = new Blob([view], { type: 'application/pdf' });
					window.open(window.URL.createObjectURL(blob));
				},
				function(err){
					alert(err.data.message);
				}
			);
			


		$scope.erstelleManagement = (management) => erstelleManagement(management);
		$scope.updateManagement = (neuerManagement) => updateManagement(neuerManagement)
		$scope.loescheManagement = () => loescheManagement();
		managementService.getManagement(paramID).then(res=> $scope.management = res.data);
		managementService.getManagements().then(res=>$scope.managements = res.data);
		$scope.managements = [];

		$scope.erstelleVeranstaltung = (veranstaltung) => erstelleVeranstaltung(veranstaltung);
		veranstaltungService.showTeilnehmer(paramID).then(res => $scope.teilnehmerz = res.data.teilnehmer);
		veranstaltungService.getVeranstaltungen().then(res=>$scope.veranstaltungen = res.data);
		$scope.veranstaltungen = [];
		$scope.param1 = paramID;
		veranstaltungService.getVeranstaltung(paramID).then(res=> $scope.veranstaltung = res.data);
		$scope.updateVeranstaltung = (neueVeranstaltung) => updateVeranstaltung(neueVeranstaltung);
		$scope.abrechnenVeranstaltung = (veranstaltung) => abrechnenVeranstaltung(veranstaltung);
		$scope.loescheVeranstaltung = () => loescheVeranstaltung();

		$scope.erstelleRaum = (raum) => erstelleRaum(raum);
		raumService.getRaeume().then(res=>$scope.raeume = res.data);
		$scope.raeume = [];
		raumService.getRaum(paramID).then(res=>$scope.raum = res.data);
		$scope.updateRaum = (neuerRaum) => updateRaum(neuerRaum);
		$scope.loescheRaum = () => loescheRaum();
		$scope.pruefeVerfuegbarkeit = (datum) => pruefeVerfuegbarkeit(datum);

		$scope.absagen = (daten) => absagen(daten);
		$scope.downloadeListe = () => downloadeListe();

		$scope.updateVeranstalter = (neuerVeranstalter) => updateVeranstalter(neuerVeranstalter);
		$scope.loescheVeranstalter = () => loescheVeranstalter();
		veranstalterService.getVeranstalter(paramID).then(res=> $scope.veranstalter = res.data);
		veranstalterService.getVeranstalters().then(res=>$scope.veranstalters = res.data);
		$scope.veranstalters = [];

		$scope.updateTeilnehmer = (neuerTeilnehmer) => updateTeilnehmer(neuerTeilnehmer);
		$scope.loescheTeilnehmer = () => loescheTeilnehmer();
		teilnehmerService.getTeilnehmer(paramID).then(res=> $scope.teilnehmer = res.data);
		teilnehmerService.getTeilnehmers().then(res=>$scope.teilnehmers = res.data);
		$scope.teilnehmers= [];

		statistikService.raumAuslastung().then(res => $scope.raumAuslastung = res.data);

		$scope.loggeOut = () => loggeOut();
		$scope.currentDate = new Date();

	}])


app.config(function($routeProvider){
	$routeProvider
		.when('/login', {
			templateUrl: 'components/login.component.html',
			controller: 'loginController'
		})
		.when('/registration', {
			templateUrl: 'components/registration.component.html',
			controller: 'loginController'
		})
		.when('/request-host', {
			templateUrl: 'components/request-host.component.html',
			controller: 'veranstalterController'
		})
		.when('/room-overview-management', {
			templateUrl: 'components/room-overview-management.component.html',
			controller: 'managementController'
		})
		.when('/room-modify-management/:id', {
			templateUrl: 'components/room-modify-management.component.html',
			controller: 'managementController',
		})
		.when('/room-create-management', {
			templateUrl: 'components/room-create-management.component.html',
			controller: 'managementController'
		})
		.when('/profile-management', {
			templateUrl: 'components/profile-management.component.html',
			controller: 'managementController'
		})
		.when('/event-overview-management', {
			templateUrl: 'components/event-overview-management.component.html',
			controller: 'managementController'
		})
		.when('/event-create-management', {
			templateUrl: 'components/event-create-management.component.html',
			controller: 'managementController'
		})
		.when('/event-modify-management', {
			templateUrl: 'components/event-modify-management.component.html',
			controller: 'managementController'
		})
		.when('/event-search-participant', {
			templateUrl: 'components/event-search-participant.component.html',
			controller: 'teilnehmerController'
		})
		.when('/profile-host', {
			templateUrl: 'components/profile-host.component.html',
			controller: 'veranstalterController'
		})
		.when('/profile-participant', {
			templateUrl: 'components/profile-participant.component.html',
			controller: 'teilnehmerController',

		})
		.when('/event-overview-host', {
			templateUrl: 'components/event-overview-host.component.html',
			controller: 'veranstalterController'
		})
		.when('/event-overview-teilnehmer-host/:id', {
			templateUrl: 'components/event-overview-teilnehmer-host.component.html',
			controller: 'veranstalterController'
		})
		.when('/event-overview-teilnehmer-admin/:id', {
			templateUrl: 'components/event-overview-teilnehmer-admin.component.html',
			controller: 'adminController'
		})
		.when('/event-overview-teilnehmer-management/:id', {
			templateUrl: 'components/event-overview-teilnehmer-management.component.html',
			controller: 'managementController'
		})
		.when('/event-overview-privat-host/:id', {
			templateUrl: 'components/event-overview-privat-host.component.html',
			controller: 'veranstalterController'
		})
		.when('/event-overview-participant', {
			templateUrl: 'components/event-overview-participant.component.html',
			controller: 'teilnehmerController'
		})
		.when('/room-overview-admin', {
			templateUrl: 'components/room-overview-admin.component.html',
			controller: 'adminController'
		})
		.when('/room-modify-admin/:id', {
			templateUrl: 'components/room-modify-admin.component.html',
			controller: 'adminController'
		})
		.when('/room-create-admin', {
			templateUrl: 'components/room-create-admin.component.html',
			controller: 'adminController'
		})
		.when('/profile-admin', {
			templateUrl: 'components/profile-admin.component.html',
			controller: 'adminController'
		})
		.when('/event-overview-admin', {
			templateUrl: 'components/event-overview-admin.component.html',
			controller: 'adminController'
		})
		.when('/event-create-admin', {
			templateUrl: 'components/event-create-admin.component.html',
			controller: 'adminController'
		})
		.when('/event-modify-admin/:id', {
			templateUrl: 'components/event-modify-admin.component.html',
			controller: 'adminController'
		})
		.when('/user-create-admin', {
			templateUrl: 'components/user-create-admin.component.html',
			controller: 'adminController'
		})
		.when('/profile-modify-host/:id', {
			templateUrl: 'components/profile-modify-host.component.html',
			controller: 'veranstalterController'
		})
		.when('/profile-modify-participant/:id', {
			templateUrl: 'components/profile-modify-participant.component.html',
			controller: 'teilnehmerController'
		})
		.when('/event-modify-management/:id', {
			templateUrl: 'components/event-modify-management.component.html',
			controller: 'managementController'
		})
		.when('/user-modify-management-admin/:id', {
			templateUrl: 'components/user-modify-management-admin.component.html',
			controller: 'adminController'
		})
		.when('/user-modify-veranstalter-admin/:id', {
			templateUrl: 'components/user-modify-veranstalter-admin.component.html',
			controller: 'adminController'
		})
		.when('/user-modify-teilnehmer-admin/:id', {
			templateUrl: 'components/user-modify-teilnehmer-admin.component.html',
			controller: 'adminController'
		})
		.when('/user-overview-admin', {
			templateUrl: 'components/user-overview-admin.component.html',
			controller: 'adminController'
		})
		.when('/bills-host', {
			templateUrl: 'components/bills-host.component.html',
			controller: 'veranstalterController'
		})
		.when('/bills-management', {
			templateUrl: 'components/bills-management.component.html',
			controller: 'managementController'
		})
		.when('/bills-admin', {
			templateUrl: 'components/bills-admin.component.html',
			controller: 'adminController'
		})
		.when('/user-modify-veranstalter-management/:id', {
			templateUrl: 'components/user-modify-veranstalter-management.component.html',
			controller: 'managementController'
		})
		.when('/user-modify-teilnehmer-management/:id', {
			templateUrl: 'components/user-modify-teilnehmer-management.component.html',
			controller: 'managementController'
		})
		.when('/user-overview-management', {
			templateUrl: 'components/user-overview-management.component.html',
			controller: 'managementController'
		})
		.otherwise({
			redirectTo: '/login'
		});
	});
