var Iov = artifacts.require("./contracts/Iov.sol");

contract("Iov", function(accounts) {
	var iovInstance;
	var i;

	it("initializes with two vehicles", function() {
		return Iov.deployed().then(function(instance) {
			return instance.vehicleCount();
		}).then(function(count) {
			assert.equal(count, 2);
		});
	});


	it("initializes with the correct values", function() {
		return Iov.deployed().then(function(instance) {
			iovInstance = instance;
			return iovInstance.vehicleArray(1);
		}).then(function(vehicle) {
			assert(vehicle[0], 1, "contains the correct id");
			assert(vehicle[1], "Vehicle 1", "contains the correct name");
			assert(vehicle[2], 10, "contains the correct trust index");
			return iovInstance.vehicleArray(2);
		}).then(function(vehicle) {
			assert(vehicle[0], 2, "contains the correct id");
			assert(vehicle[1], "Vehicle 2", "contains the correct name");
			assert(vehicle[2], 10, "contains the correct trust index");
		});
	});


	it("adds a vehicle", function() {
		// Add a vehicle
   		return Iov.deployed().then(function(instance) {
    		i = instance;
    		return i.addVehicle("new vehicle");
    	}).then(function(variable) {
    		return i.vehicleCount();
    	}).then(function(vehicleCount) {
        	i.vehicleArray(vehicleCount).then(function(vehicle) {
          	var id = vehicle[0];
          	var name = vehicle[1];
          	var trustIndex = vehicle[2];
          	$('#vehiclesList').append('<li>' + id + " " + name + " " + trustIndex + '</li>');
          	App.render();
        });    
  	});
	});


});