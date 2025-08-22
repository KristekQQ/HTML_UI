# Apollo Games UI Skeleton

Jednoduchý skeleton modulárního UI pro webové hry ApolloGames.

## Spuštění
```bash
npx http-server ui
```
Otevři `http://localhost:8080/index.html`.

## Design mód
- Přepínač v URL `?uiDesign=1`, globální flag `window.__APOLLO_UI_FLAGS__`, nebo klávesa **Ctrl+Shift+D**.
- V módu lze prvky přetahovat, měnit velikost, snappují se na grid.
- Uložení **Ctrl+S** nebo tlačítko „Uložit“.
- Export layoutu tlačítkem „Export“.

## Přidání komponenty
1. Vytvoř třídu v `ui/js/components` se stejným rozhraním.
2. Přidej konfiguraci do `ui-layout.default.json`.
3. V layoutu nastav `type` na název souboru.

## Testy
Spustíš je příkazem:
```bash
npm test
```
