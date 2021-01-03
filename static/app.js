//import {Headers} from '@angular/http';
//import {Injectable} from "@angular/core";

/*
export class AuthService {
	getProfile(){
		let headers = new Headers();
		this.loadToken();
		headers.append('Authorization', this.authToken);
	}
	storeUserData(token, user){
		localStorage.setItem('id_token', token);
		localStorage.setItem('user', JSON.stringify(user));
		this.authToken = token;
	}
	loadToken(){
		this.authToken = localStorage.getItem('id_token');
	}
}
*/

// Erstellt ein Modul mit Services (Factories) und einem zugeh�rigen Controller.
// F�r das Routing (config) muss die 'ngRoute'-Dependency gealden werden.

angular.module('dashboard', ['ngRoute'])


	//Erstelle den Service um auf die Kunden-API zuzugreifen.
	//Dazu mus die HTTP-Dependecy injected werden.
	.factory('registrierenService', ['$http', function ($http){
		function registrierenTeilnehmer(teilnehmer){
			return $http.post('/teilnehmer/registration/add', teilnehmer)

		}
		function registrierenVeranstalter(veranstalter){
			return $http.post('/veranstalter/registration/add', veranstalter)
		}
		return {registrierenTeilnehmer, registrierenVeranstalter};
	}])

	.factory('loginService', ['$http', function ($http){
		function loginTeilnehmer(daten){
			return $http.post('/teilnehmer/login', daten)
		}
		function loginVeranstalter(daten){
			return $http.post('/veranstalter/login', daten)
		}
		return {loginTeilnehmer, loginVeranstalter};
	}])

	.factory('teilnehmerService', ['$http', function ($http){
		function getTeilnehmer(userID){
			return $http.get('/teilnehmer/showOne/'+ userID)
		}
		return {getTeilnehmer};
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


	// Erstelle den Controller f�r die Dashboar-App. Hier muss der Scope injected werden und alle Services, die verwendet werden sollen.
	.controller('dashboardController', ['$scope','$routeParams', 'registrierenService', 'loginService', 'teilnehmerService', 'veranstaltungService', 'raumService', function($scope, $routeParams, registrierenService, loginService, teilnehmerService, veranstaltungService, raumService){

		  console.log('Dashboard Controller is running');
    
	  	var paramID = $routeParams.id;

    
	  function getToken(){
			return localStorage.getItem('token_id');
		}
		function getID(){
			return localStorage.getItem('user_id');
		}

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

		function loggeTeilnehmer(daten){
			$scope.daten={};
			loginService.loginTeilnehmer(daten).then(function (res){
				localStorage.setItem('user_id', res.data.userID);
				localStorage.setItem('token_id', res.data.token);
			});
		}

		function loggeVeranstalter(daten){
			$scope.daten={};
			loginService.loginVeranstalter(daten);
		}


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
	// Die Funtion muss f�r den scope verf�gbar gemacht werden.
	//$scope.updateVeranstaltung = (neueVeranstaltung) => updateVeranstaltung(neueVeranstaltung);

		$scope.erstelleTeilnehmer = (teilnehmer) => erstelleTeilnehmer(teilnehmer);
		$scope.erstelleVeranstalter = (veranstalter) => erstelleVeranstalter(veranstalter);
		$scope.loggeTeilnehmer = (daten) => loggeTeilnehmer(daten);
		$scope.loggeVeranstalter = (daten) => loggeVeranstalter(daten);

	  $scope.erstelleVeranstaltung = (veranstaltung) => erstelleVeranstaltung(veranstaltung);
	  veranstaltungService.getVeranstaltungen().then(res=>$scope.veranstaltungen = res.data);
	  $scope.veranstaltungen = [];
    $scope.param1 = paramID;
	  veranstaltungService.getVeranstaltung(paramID).then(res=> $scope.veranstaltung = res.data);

  	$scope.erstelleRaum = (raum) => erstelleRaum(raum);
  	raumService.getRaeume().then(res=>$scope.raeume = res.data);
  	$scope.raeume = [];

  	teilnehmerService.getTeilnehmer(getID()).then(res => $scope.teilnehmer = res.data);

	  /*$scope.filterByID = function (ID) {
		  return ID === 'paramId';
	  };*/
    }])


	}])

	// Hier werden die Routes angelegt, die vom Nutzer angesteuert werden k�nnen sollen.
	// Die hinterlegten Templates werden in '<div ng-view></div>' der index.html angezeigt.
	// Bei gr��erne Projekten sollten zu den einzelnen Kompotenten auch (jeweils) eigene Modules angelegt werden,
	// damit nur die f�r die Anzeige ben�tigten Daten geladen werden.
.config(function($routeProvider){
	$routeProvider
		.when('/login', {
			templateUrl: 'components/login.component.html'
		})
		.when('/registration', {
			templateUrl: 'components/registration.component.html'
		})
		.when('/request', {
			templateUrl: 'components/request.component.html'
		})
		.when('/room-overview', {
			templateUrl: 'components/room-overview.component.html'
		})
		.when('/room-modify', {
			templateUrl: 'components/room-modify.component.html'
		})
		.when('/room-create', {
			templateUrl: 'components/room-create.component.html'
		})
		.when('/profile', {
			templateUrl: 'components/profile.component.html'
		})
		.when('/event-overview', {
			templateUrl: 'components/event-overview.component.html'
		})
		.when('/event-create', {
			templateUrl: 'components/event-create.component.html'
		})
		.when('/event-modify', {
			templateUrl: 'components/event-modify.component.html'
		})
		.when('/event-search', {
			templateUrl: 'components/event-search.component.html'
		})
		.when('/profile-host', {
			templateUrl: 'components/profile-host.component.html'
		})
		.when('/profile-participant', {
			templateUrl: 'components/profile-participant.component.html'
		})
		.when('/event-overview-host', {
			templateUrl: 'components/event-overview-host.component.html'
		})
		.when('/event-overview-participant', {
			templateUrl: 'components/event-overview-participant.component.html'
		})
		.when('/stats', {
			templateUrl: 'components/stats.component.html'
		})
		.when('/email', {
			templateUrl: 'components/email.component.html'
		})
		.when('/email-host', {
			templateUrl: 'components/email-host.component.html'
		})
		.when('/email-participant', {
			templateUrl: 'components/email-participant.component.html'
		})
		.when('/room-overview-admin', {
			templateUrl: 'components/room-overview-admin.component.html'
		})
		.when('/room-modify-admin', {
			templateUrl: 'components/room-modify-admin.component.html'
		})
		.when('/room-create-admin', {
			templateUrl: 'components/room-create-admin.component.html'
		})
		.when('/profile-admin', {
			templateUrl: 'components/profile-admin.component.html'
		})
		.when('/event-overview-admin', {
			templateUrl: 'components/event-overview-admin.component.html'
		})
		.when('/event-create-admin', {
			templateUrl: 'components/event-create-admin.component.html'
		})
		.when('/event-modify-admin', {
			templateUrl: 'components/event-modify-admin.component.html'
		})
		.when('/stats-admin', {
			templateUrl: 'components/stats-admin.component.html'
		})
		.when('/email-admin', {
			templateUrl: 'components/email-admin.component.html'
		})
		.when('/event-modify/:id', {
			templateUrl: 'components/event-modify.component.html',
			//controller: 'dashboardController'
		})
		.otherwise({
			redirectTo: '/login'
		});
});
