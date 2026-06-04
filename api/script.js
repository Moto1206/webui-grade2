document.getElementById('section1-btn')
    .addEventListener('click', () => {

        fetch('https://pokeapi.co/api/v2/pokemon/pikachu')
            .then(res => res.json())
            .then(data => {
                document.getElementById('section1-result').textContent
                    = data.name + ' / HP:' + data.stats[0].base_stat;
            });
    });

    document.getElementById('section1-btn')
  .addEventListener('click', () => {

  fetch('https://pokeapi.co/api/v2/pokemon/pikachu')
    .then(res => res.json())
    .then(data => {
      document.getElementById('section1-result').textContent =
  data.stats
    .map(s => s.stat.name + ': ' + s.base_stat)
    .join(' / ');
    });
});

async function getPokemon() {
    const name = document.getElementById('name').value;
    const url = `https://pokeapi.co/api/v2/pokemon/${name}`;

    const res = await fetch(url);
    const data = await res.json();

    document.getElementById('section1-result').textContent =
        data.stats
            .map(s => s.stat.name + ': ' + s.base_stat)
            .join(' / ');
}

document.getElementById('section1-btn').addEventListener('click', getPokemon);

