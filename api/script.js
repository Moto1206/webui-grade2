// PokéShow: richer UI using PokeAPI
const searchBtn = document.getElementById('search-btn');
const nameInput = document.getElementById('name');
const randomBtn = document.getElementById('random-btn');
const shinyToggle = document.getElementById('shiny-toggle');
const message = document.getElementById('message');

const el = {
    art: document.getElementById('pokemon-image'),
    id: document.getElementById('pokemon-id'),
    name: document.getElementById('pokemon-name'),
    types: document.getElementById('pokemon-types'),
    stats: document.getElementById('pokemon-stats'),
    abilities: document.getElementById('pokemon-abilities'),
    moves: document.getElementById('pokemon-moves'),
    evo: document.getElementById('pokemon-evo'),
    height: document.getElementById('pokemon-height'),
    weight: document.getElementById('pokemon-weight')
};

const TYPE_COLORS = {
    normal: '#A8A77A', fire:'#EE8130', water:'#6390F0', electric:'#F7D02C', grass:'#7AC74C', ice:'#96D9D6', fighting:'#C22E28', poison:'#A33EA1', ground:'#E2BF65', flying:'#A98FF3', psychic:'#F95587', bug:'#A6B91A', rock:'#B6A136', ghost:'#735797', dragon:'#6F35FC', dark:'#705746', steel:'#B7B7CE', fairy:'#D685AD'
};

function setMessage(text) { message.textContent = text; }

function clear() {
    el.art.innerHTML = '—';
    el.id.textContent = '—';
    el.name.textContent = '—';
    el.types.innerHTML = '';
    el.stats.innerHTML = '';
    el.abilities.textContent = '—';
    el.moves.textContent = '—';
    el.evo.innerHTML = '—';
    el.height.textContent = '—';
    el.weight.textContent = '—';
}

async function fetchJSON(url){
    const res = await fetch(url);
    if (!res.ok) throw new Error(res.statusText || 'Network error');
    return res.json();
}

async function fetchPokemon(q){
    if (!q) { setMessage('Please enter a Pokémon name or id.'); return; }
    setMessage('Loading...');
    clear();
    try{
        const p = await fetchJSON(`https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(q.toLowerCase())}`);
    renderPokemon(p);
    currentPokemon = p;
    setMessage('Loaded.');
    }catch(err){
        setMessage('Not found or network error.');
        console.error(err);
    }
}

function renderPokemon(p){
    // artwork: prefer official artwork, fallback to front_default
    const artUrl = shinyToggle.checked ? p.sprites.other['official-artwork'].front_shiny || p.sprites.front_shiny : p.sprites.other['official-artwork'].front_default || p.sprites.front_default;
    el.art.innerHTML = '';
    const img = document.createElement('img');
    img.src = artUrl || '';
    img.alt = p.name;
    el.art.appendChild(img);

    el.id.textContent = p.id;
    el.name.textContent = p.name;
    el.height.textContent = (p.height/10) + ' m';
    el.weight.textContent = (p.weight/10) + ' kg';

    // types
    el.types.innerHTML = '';
    p.types.forEach(t => {
        const span = document.createElement('span');
        span.className = 'badge';
        span.textContent = t.type.name;
        span.style.background = TYPE_COLORS[t.type.name] || '#999';
        el.types.appendChild(span);
    });

    // stats
    el.stats.innerHTML = '';
    p.stats.forEach(s => {
        const row = document.createElement('div'); row.className = 'stat';
        const name = document.createElement('div'); name.className = 'name'; name.textContent = s.stat.name;
        const barWrap = document.createElement('div'); barWrap.className = 'bar';
        const bar = document.createElement('i');
        const pct = Math.min(100, Math.round((s.base_stat / 255) * 100));
        bar.style.width = pct + '%';
        barWrap.appendChild(bar);
        row.appendChild(name); row.appendChild(barWrap);
        el.stats.appendChild(row);
    });

    // abilities
    el.abilities.textContent = p.abilities.map(a => a.ability.name + (a.is_hidden ? ' (hidden)' : '')).join(', ');

    // moves (show top 6)
    el.moves.textContent = p.moves.slice(0,6).map(m => m.move.name).join(', ');

    // fetch species -> evolution chain
    if (p.species && p.species.url){
        fetchJSON(p.species.url).then(spec => {
            if (spec.evolution_chain && spec.evolution_chain.url) fetchEvo(spec.evolution_chain.url);
        }).catch(err => console.error(err));
    }
}

async function fetchEvo(url){
    try{
        const data = await fetchJSON(url);
        const chain = [];
        let node = data.chain;
        while(node){ chain.push(node.species.name); node = node.evolves_to && node.evolves_to[0]; }
        renderEvo(chain);
    }catch(err){ console.error(err); }
}

function renderEvo(chain){
    el.evo.innerHTML = '';
    chain.forEach((name, i) => {
        const div = document.createElement('div'); div.className = 'stage'; div.textContent = name;
        el.evo.appendChild(div);
        if (i < chain.length -1){ const arrow = document.createElement('div'); arrow.textContent = '→'; arrow.style.opacity = 0.6; el.evo.appendChild(arrow); }
    });
}

// events
searchBtn.addEventListener('click', () => fetchPokemon(nameInput.value.trim()));
nameInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') fetchPokemon(nameInput.value.trim()); });
randomBtn.addEventListener('click', async () => { const id = Math.floor(Math.random()*898)+1; fetchPokemon(String(id)); });
shinyToggle.addEventListener('change', () => { const cur = el.name.textContent; if (cur && cur !== '—') fetchPokemon(cur); });

// init with pikachu
fetchPokemon('pikachu');

// ---------- Battle Arena ----------
const loadABtn = document.getElementById('loadA-btn');
const loadBBtn = document.getElementById('loadB-btn');
const slotAInput = document.getElementById('slotA-input');
const slotBInput = document.getElementById('slotB-input');
const startBtn = document.getElementById('start-battle');
const resetBtn = document.getElementById('reset-battle');
const battleLog = document.getElementById('battle-log');

let slotA = null; // will hold pokemon data + runtime HP
let slotB = null;
let currentPokemon = null; // last fetched full pokemon data for main view

function hpFromBase(base){
    // simple formula: HP = base * 2 + 20
    return base * 2 + 20;
}

function renderSlot(slot, data){
    if (!data){
        slot.querySelector('div').textContent = '—';
        return;
    }
}

async function loadSlot(which){
    const q = which === 'A' ? slotAInput.value.trim() : slotBInput.value.trim();
    if (!q) return;
    try{
        const p = await fetchJSON(`https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(q.toLowerCase())}`);
        const runtime = { id:p.id, name:p.name, stats:p.stats, hp: hpFromBase(p.stats.find(s=>s.stat.name==='hp').base_stat), maxHp:0, sprite: p.sprites.front_default };
        runtime.maxHp = runtime.hp;
        if (which === 'A') { slotA = runtime; renderSlotA(); log(`Loaded ${runtime.name} into Slot A`); }
        else { slotB = runtime; renderSlotB(); log(`Loaded ${runtime.name} into Slot B`); }
    }catch(err){ log('Failed to load: ' + err.message); }
}

function renderSlotA(){
    const art = document.getElementById('slotA-art');
    const name = document.getElementById('slotA-name');
    const hpBar = document.getElementById('slotA-hp');
    const hpText = document.getElementById('slotA-hp-text');
    if (!slotA){ art.textContent = '—'; name.textContent = '—'; hpBar.style.width = '0%'; hpText.textContent = 'HP: —'; return; }
    art.innerHTML = slotA.sprite ? `<img src="${slotA.sprite}" alt="${slotA.name}" style="max-width:80%;max-height:80%">` : '—';
    name.textContent = `${slotA.name} (ID:${slotA.id})`;
    const pct = Math.max(0, Math.round((slotA.hp/slotA.maxHp)*100));
    hpBar.style.width = pct + '%';
    hpText.textContent = `HP: ${slotA.hp} / ${slotA.maxHp}`;
}

function renderSlotB(){
    const art = document.getElementById('slotB-art');
    const name = document.getElementById('slotB-name');
    const hpBar = document.getElementById('slotB-hp');
    const hpText = document.getElementById('slotB-hp-text');
    if (!slotB){ art.textContent = '—'; name.textContent = '—'; hpBar.style.width = '0%'; hpText.textContent = 'HP: —'; return; }
    art.innerHTML = slotB.sprite ? `<img src="${slotB.sprite}" alt="${slotB.name}" style="max-width:80%;max-height:80%">` : '—';
    name.textContent = `${slotB.name} (ID:${slotB.id})`;
    const pct = Math.max(0, Math.round((slotB.hp/slotB.maxHp)*100));
    hpBar.style.width = pct + '%';
    hpText.textContent = `HP: ${slotB.hp} / ${slotB.maxHp}`;
}

function log(text){
    const p = document.createElement('div'); p.textContent = `[${new Date().toLocaleTimeString()}] ${text}`; battleLog.prepend(p);
}

function resetBattle(){
    slotA = null; slotB = null; battleLog.innerHTML = ''; renderSlotA(); renderSlotB();
}

function computeDamage(attacker, defender){
    // simple damage formula using attack / defense-ish mapping
    const atk = attacker.stats.find(s=>s.stat.name==='attack')?.base_stat || 10;
    const spAtk = attacker.stats.find(s=>s.stat.name==='special-attack')?.base_stat || 10;
    const def = defender.stats.find(s=>s.stat.name==='defense')?.base_stat || 10;
    const spDef = defender.stats.find(s=>s.stat.name==='special-defense')?.base_stat || 10;
    // mix physical and special
    const phys = Math.max(1, atk - Math.floor(def/2));
    const spec = Math.max(1, spAtk - Math.floor(spDef/2));
    const base = Math.round((phys + spec)/2);
    // random factor
    const rand = 0.85 + Math.random()*0.3; // 0.85 - 1.15
    return Math.max(1, Math.round(base * rand));
}

async function startBattle(){
    if (!slotA || !slotB){ log('Both slots must be loaded.'); return; }
    log(`Battle start: ${slotA.name} vs ${slotB.name}`);
    // decide first by speed
    const speedA = slotA.stats.find(s=>s.stat.name==='speed')?.base_stat || 10;
    const speedB = slotB.stats.find(s=>s.stat.name==='speed')?.base_stat || 10;
    let attacker = speedA >= speedB ? slotA : slotB;
    let defender = attacker === slotA ? slotB : slotA;

    // loop until one HP <= 0
    while(slotA.hp > 0 && slotB.hp > 0){
        const dmg = computeDamage(attacker, defender);
        defender.hp = Math.max(0, defender.hp - dmg);
        log(`${attacker.name} hits ${defender.name} for ${dmg} damage.`);
        renderSlotA(); renderSlotB();
        if (defender.hp <= 0){ log(`${defender.name} fainted. ${attacker.name} wins!`); break; }
        // swap
        [attacker, defender] = [defender, attacker];
        // small delay for readability (await)
        await new Promise(r=>setTimeout(r, 600));
    }
}

// wire buttons
loadABtn.addEventListener('click', () => loadSlot('A'));
loadBBtn.addEventListener('click', () => loadSlot('B'));
startBtn.addEventListener('click', startBattle);
resetBtn.addEventListener('click', resetBattle);

// Set currently viewed Pokémon into slot A / B
const setSlotABtn = document.getElementById('set-slotA');
const setSlotBBtn = document.getElementById('set-slotB');
if (setSlotABtn) setSlotABtn.addEventListener('click', () => {
    if (!currentPokemon) { log('No Pokémon loaded to assign.'); return; }
    slotA = { id: currentPokemon.id, name: currentPokemon.name, stats: currentPokemon.stats, hp: hpFromBase(currentPokemon.stats.find(s=>s.stat.name==='hp').base_stat), maxHp:0, sprite: currentPokemon.sprites.front_default };
    slotA.maxHp = slotA.hp; renderSlotA(); log(`Assigned ${slotA.name} to Slot A`);
});
if (setSlotBBtn) setSlotBBtn.addEventListener('click', () => {
    if (!currentPokemon) { log('No Pokémon loaded to assign.'); return; }
    slotB = { id: currentPokemon.id, name: currentPokemon.name, stats: currentPokemon.stats, hp: hpFromBase(currentPokemon.stats.find(s=>s.stat.name==='hp').base_stat), maxHp:0, sprite: currentPokemon.sprites.front_default };
    slotB.maxHp = slotB.hp; renderSlotB(); log(`Assigned ${slotB.name} to Slot B`);
});

