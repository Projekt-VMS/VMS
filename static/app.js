
// Erstellt ein Modul mit Services (Factories) und einem zugeh�rigen Controller.
// F�r das Routing (config) muss die 'ngRoute'-Dependency gealden werden.

var app = angular.module('app', ['ngRoute']);


	//Erstelle den Service um auf die Kunden-API zuzugreifen.
	//Dazu mus die HTTP-Dependecy injected werden.
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
				.catch(err=>console.log(err.toString()));
		}
		function loginVeranstalter(daten){
			return $http.post('/veranstalter/login', daten)
		}
		function loginManagement(daten){
			return $http.post('/management/login', daten)
		}
		return {loginTeilnehmer, loginVeranstalter, loginManagement};
	}])

	.factory('teilnehmerService', ['$http', function ($http){
		function getTeilnehmer(userID){
			return $http.get('/teilnehmer/showOne/'+ userID)
				.catch(err=>console.log(err.toString()));
		}
		return {getTeilnehmer};
	}])

	.factory('veranstalterService', ['$http', function ($http){
		function getVeranstalter(userID){
			return $http.get('/veranstalter/showOne/'+ userID)
				.catch(err=>console.log(err.toString()));
		}
		return {getVeranstalter};
	}])

	.factory('veranstaltungService', ['$http', function ($http){
		function createVeranstaltung(veranstaltung){
			return $http.post('/veranstaltung/add', veranstaltung)

		}
		function getVeranstaltungen(){
			return $http.get('/veranstaltung/show')
				.catch(err=>console.log(err.toString()));

		}

		function getVeranstaltung(veranstaltungID){
			return $http.get('/veranstaltung/showOne/'+veranstaltungID)
				.catch(err=>console.log(err.toString()));

		}

		function editVeranstaltung(veranstaltungID, veranstaltung){
			return	$http.put('/veranstaltung/edit/'+veranstaltungID, veranstaltung)
				.catch(err=>console.log(err.toString()));

		}
		return {createVeranstaltung, getVeranstaltungen, getVeranstaltung, editVeranstaltung}
    
	}])

	.factory('raumService', ['$http', function ($http){
		function createRaum(raum){
			return $http.post('/raum/add', raum)
		}
		function getRaeume(){
			return $http.get('/raum/show')
				.catch(err=>console.log(err.toString()));
		}
		return {createRaum, getRaeume}
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

app.controller('loginController', ['$scope', 'registrierenService', 'loginService', function ($scope, registrierenService, loginService){
	console.log('Login Controller is running');

	function erstelleTeilnehmer(teilnehmer){
		// Input-Felder zur�cksetzen.
		$scope.teilnehmer={};
		// Daten an Service weiterleiten.
		registrierenService.registrierenTeilnehmer(teilnehmer);
	}

	function erstelleVeranstalter(veranstalter){
		$scope.veranstalter={};
		registrierenService.registrierenVeranstalter(veranstalter)
	}

	function erstelleManagement(management){
			$scope.management={};
			registrierenService.registrierenManagement(management)
	}


	function loggeTeilnehmer(daten){
		$scope.daten={};
		loginService.loginTeilnehmer(daten).then(function (res){
			localStorage.setItem('user_id', res.data.userID);
			localStorage.setItem('token_id', res.data.token);
		}).catch(
			//error => $scope.error = error
			//alert(JSON.stringify(error))
			error => alert(error.message)
		);
	}

	function loggeVeranstalter(daten){
		$scope.daten={};
		loginService.loginVeranstalter(daten).then(function (res){
			localStorage.setItem('user_id', res.data.userID);
			localStorage.setItem('token_id', res.data.token);
		}).catch(
			error => alert(error.message)
		);
	}

	function loggeManagement(daten){
			$scope.daten={};
			loginService.loginManagement(daten);
	}


	$scope.erstelleTeilnehmer = (teilnehmer) => erstelleTeilnehmer(teilnehmer);
	$scope.erstelleVeranstalter = (veranstalter) => erstelleVeranstalter(veranstalter);
	$scope.loggeTeilnehmer = (daten) => loggeTeilnehmer(daten);
	$scope.loggeVeranstalter = (daten) => loggeVeranstalter(daten);
}])

app.controller('teilnehmerController', ['$scope','tokenService', 'teilnehmerService', function($scope, tokenService, teilnehmerService){
	console.log('Teilnehmer Controller');

	teilnehmerService.getTeilnehmer(tokenService.getID()).then(res => $scope.teilnehmer = res.data);
}])

app.controller('veranstalterController', ['$scope', 'tokenService', 'veranstalterService', function ($scope, tokenService, veranstalterService){
	console.log('Veranstalter Controller');
	veranstalterService.getVeranstalter(tokenService.getID()).then(res => $scope.veranstalter = res.data);
}])

app.controller('managementController', ['$scope','$routeParams', 'veranstaltungService', 'raumService', function($scope, $routeParams, veranstaltungService, raumService){

	console.log('Management Controller');

	var paramID = $routeParams.id;


	function erstelleVeranstaltung(veranstaltung){
		$scope.daten={};
		veranstaltungService.createVeranstaltung(veranstaltung);
	}

	function erstelleRaum(raum){
		$scope.raum={};
		raumService.createRaum(raum);
	}

		/*function updateVeranstaltung(neueVeranstaltung){
			$scope=neueVeranstaltung={};
			neueVeranstaltung.titel = neueVeranstaltung.titel;
			veranstaltungService.editVeranstaltung(neueVeranstaltung);
		}*/

		//$scope.updateVeranstaltung = (neueVeranstaltung) => updateVeranstaltung(neueVeranstaltung);


		$scope.erstelleManagement = (management) => erstelleManagement(management);
		$scope.loggeManagement = (daten) => loggeManagement(daten);


	  	$scope.erstelleVeranstaltung = (veranstaltung) => erstelleVeranstaltung(veranstaltung);
	  	$scope.zeigeVeranstaltungen = veranstaltungService.getVeranstaltungen().then(res=>$scope.veranstaltungen = res.data);
	  	$scope.veranstaltungen = [];
	  	$scope.param1 = paramID;
	  	$scope.zeigeVeranstaltung = veranstaltungService.getVeranstaltung(paramID).then(res=> $scope.veranstaltung = res.data);

	  	$scope.erstelleRaum = (raum) => erstelleRaum(raum);
	  	raumService.getRaeume().then(res=>$scope.raeume = res.data);
	  	$scope.raeume = [];

	  	/*$scope.filterByID = function (ID) {
		  return ID === 'paramId';
	  	};*/
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
		.when('/request', {
			templateUrl: 'components/request.component.html',
			controller: 'managementController'
		})
		.when('/room-overview-management', {
			templateUrl: 'components/room-overview-management.component.html',
			controller: 'managementController'
		})
		.when('/room-modify-management', {
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
		.when('/event-search', {
			templateUrl: 'components/event-search.component.html',
			controller: 'teilnehmerController'
		})
		.when('/profile-host', {
			templateUrl: 'components/profile-host.component.html',
			controller: 'veranstalterController'
		})
		.when('/profile-participant', {
			templateUrl: 'components/profile-participant.component.html',
			controller: 'teilnehmerController'
		})
		.when('/event-overview-host', {
			templateUrl: 'components/event-overview-host.component.html',
			controller: 'veranstalterController'
		})
		.when('/event-overview-participant', {
			templateUrl: 'components/event-overview-participant.component.html',
			controller: 'teilnehmerController'
		})
		.when('/stats-management', {
			templateUrl: 'components/stats-management.component.html',
			controller: 'managementController'
		})
		.when('/email-management', {
			templateUrl: 'components/email-management.component.html',
			controller: 'managementController'
		})
		.when('/email-host', {
			templateUrl: 'components/email-host.component.html',
			controller: 'managementController'
		})
		.when('/email-participant', {
			templateUrl: 'components/email-participant.component.html',
			controller: 'teilnehmerController'
		})
		.when('/room-overview-admin', {
			templateUrl: 'components/room-overview-admin.component.html',
			controller: ''
		})
		.when('/room-modify-admin', {
			templateUrl: 'components/room-modify-admin.component.html',
			controller: ''
		})
		.when('/room-create-admin', {
			templateUrl: 'components/room-create-admin.component.html',
			controller: ''
		})
		.when('/profile-admin', {
			templateUrl: 'components/profile-admin.component.html',
			controller: ''
		})
		.when('/event-overview-admin', {
			templateUrl: 'components/event-overview-admin.component.html',
			controller: ''
		})
		.when('/event-create-admin', {
			templateUrl: 'components/event-create-admin.component.html',
			controller: ''
		})
		.when('/event-modify-admin', {
			templateUrl: 'components/event-modify-admin.component.html',
			controller: ''
		})
		.when('/stats-admin', {
			templateUrl: 'components/stats-admin.component.html',
			controller: ''
		})
		.when('/email-admin', {
			templateUrl: 'components/email-admin.component.html',
			controller: 'dashboardController'
		})
		.when('/user-create', {
			templateUrl: 'components/user-create.component.html'
		})
		.when('/event-modify-management/:id', {
			templateUrl: 'components/event-modify-management.component.html',
			controller: 'managementController'
		})
		.otherwise({
			redirectTo: '/login'
		});
	});
