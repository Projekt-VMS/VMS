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
		function getTeilnehmer(token){
			return $http.get('/teilnehmer/show', { Authorization: `Bearer ${token}` })
			//return $http.get('/teilnehmer/show', {headers: headers})
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
		return {createVeranstaltung, getVeranstaltungen, getVeranstaltung}
}])


// Erstelle den Controller f�r die Dashboar-App. Hier muss der Scope injected werden und alle Services, die verwendet werden sollen.
.controller('dashboardController', ['$scope','$routeParams', 'registrierenService', 'loginService', 'teilnehmerService', 'veranstaltungService', function($scope, $routeParams, registrierenService, loginService, teilnehmerService, veranstaltungService){

	console.log('Dashboard Controller is running');

	var paramID = $routeParams.id;

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
		loginService.loginTeilnehmer(daten);

	}

	function loggeVeranstalter(daten){
		$scope.daten={};
		loginService.loginVeranstalter(daten);
	}

	function erstelleVeranstaltung(veranstaltung){
		$scope.daten={};
		veranstaltungService.createVeranstaltung(veranstaltung);
	}




	$scope.erstelleTeilnehmer = (teilnehmer) => erstelleTeilnehmer(teilnehmer);
	$scope.erstelleVeranstalter = (veranstalter) => erstelleVeranstalter(veranstalter);
	$scope.loggeTeilnehmer = (daten) => loggeTeilnehmer(daten);
	$scope.loggeVeranstalter = (daten) => loggeVeranstalter(daten);

	$scope.erstelleVeranstaltung = (veranstaltung) => erstelleVeranstaltung(veranstaltung);

	veranstaltungService.getVeranstaltungen().then(res=>$scope.veranstaltungen = res.data);
	$scope.veranstaltungen = [];
	$scope.param1 = paramID;
	veranstaltungService.getVeranstaltung(paramID);



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
		.when('/offer-create', {
			templateUrl: 'components/offer-create.component.html'
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
		.when('/event-modify/:id', {
			templateUrl: 'components/event-modify.component.html',
			controller: 'dashboardController'
		})
	.otherwise({
		redirectTo: '/login'
	});
});

