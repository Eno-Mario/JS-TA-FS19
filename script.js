/* -----------------
    Preparazione
--------------------*/

const container = document.querySelector(".container");
const apiDefault = "https://pokeapi.co/api/v2/pokemon?limit=151";
const pokemonData = [];
let pokemonShown = [];

//order by element
const order = document.querySelector("#order");

//Filter Elements
const filters = Array.prototype.slice.call(document.querySelectorAll("input"));

const filteredPokemon = {
  0: [],
  1: [],
  2: [],
  3: [],
  4: [],
  5: [],
};

//event listener
order.addEventListener("change", (e) => handleOrder(e.target.value));

filters.forEach((el) =>
  el.addEventListener("change", (e) => handleFilter(e.target))
);

/* -----------------
    Logica
--------------------*/

fetcher(apiDefault)
  .then((data) =>
    data.results.forEach((el) =>
      fetcher(el.url).then((resp) => {
        cardCreatrion(resp);
        pokemonData.push(resp);
        pokemonShown.push(resp);
      })
    )
  )
  .catch((err) => console.log(err));

/* -----------------
    Funzioni
--------------------*/

async function fetcher(api) {
  try {
    const response = await fetch(api);
    const dataResposne = await response.json();

    return dataResposne;
  } catch (error) {
    console.log(err);
  }
}

async function cardCreatrion(pokemonData) {
  const card = document.createElement("div");
  card.classList.add("card");

  const sprite = document.createElement("img");
  sprite.setAttribute("src", pokemonData.sprites.front_default);

  const nomePokemon = document.createElement("h3");
  nomePokemon.innerText = pokemonData.name;

  const stats = document.createElement("ul");
  const statsData = pokemonData.stats;
  statsData.forEach((el) => {
    const stat = document.createElement("li");
    stat.innerText = `${el.stat.name}: ${el.base_stat}`;
    stats.appendChild(stat);
  });

  card.appendChild(sprite);
  card.appendChild(nomePokemon);
  card.appendChild(stats);

  container.appendChild(card);

  /* container.innerHTML =
    container.innerHTML +
    `
      <div>
  <img src = ${pokemonData.sprites.front_default} onclick=(console.log("ciao"))>
  <div>${pokemonData.name}</div>
  

  <ul>
  <li>${pokemonData.stats[0].stat.name}: ${pokemonData.stats[0].base_stat}</li>
  <li>${pokemonData.stats[1].stat.name}: ${pokemonData.stats[1].base_stat}</li>
  <li>${pokemonData.stats[2].stat.name}: ${pokemonData.stats[2].base_stat}</li>
  <li>${pokemonData.stats[2].stat.name}: ${pokemonData.stats[3].base_stat}</li>
  <li>${pokemonData.stats[2].stat.name}: ${pokemonData.stats[4].base_stat}</li>
  <li>${pokemonData.stats[2].stat.name}: ${pokemonData.stats[5].base_stat}</li></ul>
  </div>
  `; */
}

function handleOrder(orderBy) {
  if (orderBy !== "") {
    pokemonShown.sort(
      (a, b) => b.stats[orderBy].base_stat - a.stats[orderBy].base_stat
    );
    container.innerHTML = "";
    pokemonShown.forEach((el) => cardCreatrion(el));
  }
}

function handleFilter(filter) {
  const attToFilter = filter.name;

  const value = filter.value.split("-");

  if (filter.checked) {
    filteredPokemon[attToFilter] = [
      ...filteredPokemon[attToFilter],
      ...pokemonData.filter(
        (a) =>
          a.stats[attToFilter].base_stat > Number(value[0]) &&
          a.stats[attToFilter].base_stat <= Number(value[1])
      ),
    ];
  } else {
    let toSplice = [
      ...pokemonData.filter(
        (a) =>
          a.stats[attToFilter].base_stat > Number(value[0]) &&
          a.stats[attToFilter].base_stat <= Number(value[1])
      ),
    ];
    toSplice.forEach((el) =>
      filteredPokemon[attToFilter].splice(
        filteredPokemon[attToFilter].indexOf(el),
        1
      )
    );
  }

  pokemonShown = pokemonData;

  for (let i = 0; i < Object.keys(filteredPokemon).length; i++) {
    if (filteredPokemon[i].length > 0) {
      pokemonShown = pokemonShown.filter((a) => filteredPokemon[i].includes(a));
    }
  }

  container.innerHTML = "";

  if (order.value !== "") handleOrder(order.value);
  else pokemonShown.forEach((el) => cardCreatrion(el));
}
