import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Text "mo:core/Text";
import Order "mo:core/Order";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";

actor {
  type Registration = {
    teamName : Text;
    captainName : Text;
    phoneNumber : Text;
    tournament : Text;
  };

  module Registration {
    public func compare(reg1 : Registration, reg2 : Registration) : Order.Order {
      switch (Text.compare(reg1.teamName, reg2.teamName)) {
        case (#equal) { Text.compare(reg1.captainName, reg2.captainName) };
	      case (order) { order };
      };
    };

    public func compareByTournament(reg1 : Registration, reg2 : Registration) : Order.Order {
      Text.compare(reg1.tournament, reg2.tournament);
    };
  };

  let registrationMap = Map.empty<Principal, Registration>();

  public shared ({ caller }) func submitRegistration(teamName : Text, captainName : Text, phoneNumber : Text, tournament : Text) : async () {
    let registration : Registration = {
      teamName;
      captainName;
      phoneNumber;
      tournament;
    };
    registrationMap.add(caller, registration);
  };

  public query ({ caller }) func getMyRegistration() : async Registration {
    switch (registrationMap.get(caller)) {
      case (null) { Runtime.trap("You are not registered.") };
      case (?registration) { registration };
    };
  };

  public query func getAllRegistrations() : async [Registration] {
    registrationMap.values().toArray().sort();
  };

  public query func getAllRegistrationsByTournament() : async [Registration] {
    registrationMap.values().toArray().sort(Registration.compareByTournament);
  };

  public query ({ caller }) func isRegistered() : async Bool {
    registrationMap.containsKey(caller);
  };
};
