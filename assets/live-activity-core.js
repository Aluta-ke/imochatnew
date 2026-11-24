(function (root) {
  "use strict";

  var PEOPLE = [
    { name: "James", country: "Kenya", flag: "ke" },
    { name: "Amina", country: "Kenya", flag: "ke" },
    { name: "Wanjiku", country: "Kenya", flag: "ke" },
    { name: "Sarah", country: "Uganda", flag: "ug" },
    { name: "Grace", country: "Uganda", flag: "ug" },
    { name: "Asha", country: "Tanzania", flag: "tz" },
    { name: "Neema", country: "Tanzania", flag: "tz" },
    { name: "Chioma", country: "Nigeria", flag: "ng" },
    { name: "Tunde", country: "Nigeria", flag: "ng" },
    { name: "Ama", country: "Ghana", flag: "gh" },
    { name: "Kwame", country: "Ghana", flag: "gh" },
    { name: "Marie", country: "Cameroon", flag: "cm" },
    { name: "Paul", country: "Cameroon", flag: "cm" },
    { name: "Chipo", country: "Zambia", flag: "zm" },
    { name: "Mutale", country: "Zambia", flag: "zm" },
    { name: "Thabo", country: "South Africa", flag: "za" },
    { name: "Lerato", country: "South Africa", flag: "za" },
    { name: "Oliver", country: "United Kingdom", flag: "gb" },
    { name: "Hannah", country: "United Kingdom", flag: "gb" },
    { name: "Michael", country: "USA", flag: "us" },
    { name: "Jessica", country: "USA", flag: "us" },
    { name: "Daniel", country: "Canada", flag: "ca" },
    { name: "Anna", country: "Germany", flag: "de" },
    { name: "Camille", country: "France", flag: "fr" }
  ];

  function shuffle(list, random) {
    for (var i = list.length - 1; i > 0; i--) {
      var j = Math.floor(random() * (i + 1));
      var swap = list[i];
      list[i] = list[j];
      list[j] = swap;
    }
  }

  function notice(person, category) {
    if (category === "withdrawal") {
      return {
        id: "withdrawal:" + person.name + ":" + person.flag,
        category: "withdrawal",
        label: "Withdrawal",
        flag: person.flag,
        country: person.country,
        name: person.name,
        text: person.name + " from " + person.country + " just withdrawn"
      };
    }
    if (category === "activation") {
      return {
        id: "activation:" + person.name + ":" + person.flag,
        category: "activation",
        label: "Activation",
        flag: person.flag,
        country: person.country,
        name: person.name,
        text: person.name + " from " + person.country + " activated an account!"
      };
    }
    return {
      id: "registration:" + person.name + ":" + person.flag,
      category: "registration",
      label: "New registration",
      flag: person.flag,
      country: person.country,
      name: person.name,
      text: person.name + " from " + person.country + " just joined ImoChat!"
    };
  }

  function pull(list, lastFlag) {
    var found = 0;
    for (var n = 0; n < list.length; n++) {
      if (list[n].flag !== lastFlag) {
        found = n;
        break;
      }
    }
    return list.splice(found, 1)[0];
  }

  function buildQueue(region, random) {
    var people = PEOPLE.slice();
    if (typeof random === "function") shuffle(people, random);
    if (region === "KE" || region === "UG") {
      for (var k = 0; k < people.length; k++) {
        if (people[k].flag === "ke") {
          if (k > 0) people.unshift(people.splice(k, 1)[0]);
          break;
        }
      }
    }
    var countries = [];
    var seen = {};
    for (var c = 0; c < people.length; c++) {
      if (!seen[people[c].flag]) {
        seen[people[c].flag] = 1;
        countries.push(people[c]);
      }
    }
    var queue = [];
    var lastFlag = "";
    var step = 0;
    while (people.length || countries.length) {
      var category = ["registration", "activation", "withdrawal"][step % 3];
      step += 1;
      if (category === "withdrawal" && !countries.length) category = "registration";
      if (category !== "withdrawal" && !people.length) category = "withdrawal";
      var person = category === "withdrawal" ? pull(countries, lastFlag) : pull(people, lastFlag);
      lastFlag = person.flag;
      queue.push(notice(person, category));
    }
    for (var i = 1; i < queue.length - 1; i++) {
      if (queue[i].flag !== queue[i - 1].flag) continue;
      for (var j = i + 1; j < queue.length; j++) {
        var candidate = queue[j];
        if (candidate.flag === queue[i - 1].flag) continue;
        if (i + 1 < queue.length && j !== i + 1 && candidate.flag === queue[i + 1].flag) continue;
        queue.splice(j, 1);
        queue.splice(i, 0, candidate);
        break;
      }
    }
    return queue;
  }

  root.ImoChatLive = { buildQueue: buildQueue };
})(typeof globalThis !== "undefined" ? globalThis : this);
