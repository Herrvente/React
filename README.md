# Kiss Levente


- Teendőket kezelő alkalmazás

- Beüzemelés: npm install => npm start. A szerver futtatása után a [http://localhost:3000](http://localhost:3000) porton nyitható meg a kliens.

- Kliens oldal felépítése egy egyszerű single page application a React könyvtár segítségével.

 Az oldal felépítéséhez három főbb komponenst használtam. Ezek a következők: App.js, ListGroupComponens.js, TodoListItemComponens.js. A kinézeti stílusért a Bootstrap felelős.
 
 A működésbeli függvények és az oldal alap kinézete az App.js-ben van leírva.  Itt találhatóak a szerverrel való kommunikáciért felelős függvények, melyek fetch-eléssel végzik feladatukat. Amikor az App.js betöltődik, az adatokat lekérem a szerverről a useEffect fügvénnyel, ami feltölti adatokkal a négy darab listát, amiben tárolom a todokat. A state váltóban lesz benne a négy tábla. 
Új elem létrehozására a Navbaron belül van lehetőség, ahol meg kell adni a Teendő címét, leírását, és a dátumot. A hozzáadásért a Formban található onSubmit felel, a title, body és date változókban elmenti a megadott értékeket, majd meghívja a Register függvényt. A Registerben megtörténik a szerverrel való kommunikáció, és a paraméterként kapott item elmentésre kerül az adatbázisban, azon belül a Todo táblában. A törlés funkció meghívására minden Todo jobb alsó sarkában lévő gomb megnyomásával van lehetőség. A gomb a TodoListItemComponentben van implementálva ami onClick eseményre az App.js-ben lévő Delete függvényt hívja meg. Ebben a függvényben megkeressük melyik táblában van az adott ID-val rendelkező todo és töröljük az adatbázisból. A prioritás változtatása Drag&Drop implementálásával valósul meg. Lehetőség van a különböző táblák között és egy adott táblában mozgatni a todo-t. A megvalósításért a handleDragEnd függvény felelős, ami csinál egy copy elemet az adott todo-ról, törli az aktuális helyéről, majd a lemásolt elemet az új helyére teszi. Ebben a függvényben két külön fetch-re van bontva, hogy a táblák között mozgatjuk az elemet, vagy csak prioritást változtatunk. A szerver elmenti a változtatást.

A ListGroupComponentben a táblák kinézete és az van leírva, hogy az adott táblákban lévő elemek mozgathatóak legyenek Drag&Drop-al.
Minden egyes táblában meghívásra kerül a TodoListItemComponent, melyben nem a táblák, hanem az adott elemek kinézete és az van megvalósítva, hogy az elemek mozgathatóak legyenek. Illetve a korábban említett törlés gomb. A dátum megfelelő formátumáért a formatDate függvény felel.
  
- Szerver oldali felépítés C# nyelven .NetCore Web Api, SQLite adatbázissal.

 
 A backend rész egy Visual Studio által generált ASP.NET Core Web API. A Startup.cs-ban hozzá adjuk a controllereket a ServiceCollection-höz. a Configure metódusban a controllerek maguk mondják meg, hogy milyen kérésekre válaszolnak. Egy Todo-nak a tulajdonságai a TodoItem.cs-ben vannak definiálva.
 Az adatok manipulációjára a TodoItemsController felelős, ami Api végpontokat előállító controller ([ApiController]).
 TodoItemsConroller-ben lévő GetTodos metódus ([HttpGet]) visszaadja az adatbázisban lévő TodoItem-eket. A PostOdo metódus ([HttpPost]) felelős a kliens oldali hozzáadást kezelni. Látható, hogy előre beállított táblához adja hozzá, a Todo táblához, majd vissza adja a Todo táblát. A DeleteTodo metódus ([HttpDelete("{id:int}")]) törli a paraméterként kapott ID alapján az elemet az adatbázisból, majd vissza ad egy 200-as Ok státuszt. A PutTodoTable függvény [HttpPut("table")] felelős a táblák közötti változtatásért, ami a szükséges adatokat Query paraméterként kap meg a klienstől. A Todok közötti prioritás változtatásáért a PutTodoPrioritas függvény ([HttpPut]) felelős, ami kitörli a Queryből kapott id alapján a Todot a régi helyéről, majd beilleszti az új helyre. A végpontok tesztelhetőek swaggerrel is.
