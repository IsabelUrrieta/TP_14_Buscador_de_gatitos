const $$ = (elem) => document.querySelectorAll(elem);
const $ = (elem) => document.querySelector(elem);

const inicializarTabs = () => {
    $$(".tabs li a").forEach((tab) =>
        tab.addEventListener("click", actualizarTab)
    );
};
const actualizarTab = (evento) => {
    // Oculto secciones
    $$(".tab-section").forEach((section) => section.classList.add("is-hidden"));
    // Muestro sección activa
    const idSeccion = evento.target.getAttribute("href");//"#breeds"
    $(idSeccion).classList.remove("is-hidden");
    // Deselecciona tabs
    $$(".tabs li").forEach((tab) => tab.classList.remove("is-active"));
    // Selecciona tab activa
    evento.target.parentElement.classList.add("is-active");
};


inicializarTabs();

/* ### 2. Sección Random

Hacer funcionar la sección`Random`, para eso:

- al cargar la página y al hacer click en el botón, debería cargar una nueva imagen de un gato
    - usar el siguiente endpoint: https://api.thecatapi.com/v1/images/search/
- ** EXTRA:** agregarle al botón la clase`is-loading` antes de hacer el pedido y sacársela cuando se obtiene la respuesta
    <br> */

const btnRandom = document.getElementById("btn-random");
const imgAleatorio = document.getElementById("img");
let data;

const updateImg = async () => {
    const response = await fetch("https://api.thecatapi.com/v1/images/search/");
    data = await response.json();
    imgAleatorio.src = data[0].url;
};
btnRandom.addEventListener("click", (e) => {
    updateImg();

})
updateImg();
/* ### 3. Sección`Búsqueda de razas`

Hacer la sección`Búsqueda de razas`, para eso:

- al hacer click en el botón de búsqueda, obtener el`value` del input de búsqueda
    - con ese dato, hacer una consulta a https://api.thecatapi.com/v1/breeds/search?q=busqueda, reemplazando `busqueda` por el `value` del input
- con la respuesta, actualizar la tabla para mostrar los nombres de las razas
    - ** EXTRA:** agregarle al botón y al input la clase`is-loading` antes de hacer el pedido y sacársela cuando se obtiene la respuesta
        - ** EXTRA:** hacer que funcione cuando se da enter al escribir la búsqueda
            <br> */
const btnSearchBtn = document.getElementById("breed-search-btn");
const inputSearch = document.getElementById("breed-search-input");
const tbody = document.getElementById("breed-search-results");

let dataSearch;

const GetBreed = async () => {
    const response = await fetch(`https://api.thecatapi.com/v1/breeds/search?q=${inputSearch.value}`);
    dataSearch = await response.json();

    tbody.innerHTML = dataSearch.reduce((html, breed) => {
        return html + ` <tr>
            <td>${breed.name}</td>
          </tr>`
    }, "")

};
btnSearchBtn.addEventListener("click", (e) => {
    GetBreed();
})
GetBreed();
/* ### 4. Sección`Razas`

Hacer funcionar la sección`Razas`, para eso

    - al cargar la página, cargar la lista de razas con el endpoint: https://api.thecatapi.com/v1/breeds
    - actualizar el select con los nombres de las razas, el option debería tener como value el id de la raza, por ejemplo
        ```html
  <option value="beng">Bengal</option>
  ```
        - Agregarle al primer`option` el atributo`selected` 
            - cuando se selecciona una raza, actualizar la información con imagen, descripción y temperamento
                - para reaccionar a la selección de una opción en un`select`, tenemos el evento`change`.El`value` de un`select` es el`value` del`option` 
                seleccionado
                    - para actualizar la info de una raza, usar el endpoint: https://api.thecatapi.com/v1/breeds/:id, donde `:id` es el id del value del select,
                    por ejemplo https://api.thecatapi.com/v1/breeds/beng
                    - la imagen la obtenemos de https://api.thecatapi.com/v1/images/search?breed_ids=raza_id, donde `raza_id` es el id de la raza
- al cargar la página, actualizar la info de la raza con la primera raza de la consulta

    <br> */
const breedSelection = document.getElementById("breed-dropdown");
const breedname = document.getElementById("breed-name");
const breedDescription = document.getElementById("breed-description");
const breedimgDescription = document.getElementById("breed-img");
const getInfoTags = document.getElementById("breed-temperament");
let dataBreed;
let dataBreedselect;
let breedImg;
let breedTag;
breedSelection.addEventListener("change", (e) => {
    getSelectedBreedInfo(breedSelection.value);
    getImgInfo(breedSelection.value);
})

const getBreedInfo = async () => {
    const response = await fetch(`https://api.thecatapi.com/v1/breeds`);
    dataBreed = await response.json();
    breedSelection.innerHTML = dataBreed.reduce((html, breed) => {
        return html + ` <option value="${breed.id}">${breed.name}</option>`
    }, "")
    getSelectedBreedInfo(breedSelection.value);
    getImgInfo(breedSelection.value);

};


const getSelectedBreedInfo = async (breed) => {
    const response = await fetch(`https://api.thecatapi.com/v1/breeds/${breed}`);
    dataBreedselect = await response.json();
    breedname.innerHTML = dataBreedselect.name;
    breedDescription.innerHTML = dataBreedselect.description;

}
const getImgInfo = async (breed) => {
    const response = await fetch(`https://api.thecatapi.com/v1/images/search?breed_ids=${breed}`);
    breedImg = await response.json();
    breedimgDescription.src = breedImg[0].url;
}

getBreedInfo();