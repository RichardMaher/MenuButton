import sheet from './menu-button.css' assert {type: 'css'};

export class ABCMenuButton extends HTMLElement 
{
	#shadowRoot;
	#button;
	
    constructor() {
        super();

        this.#shadowRoot = this.attachShadow({ mode: 'open' });
		this.#shadowRoot.adoptedStyleSheets = [sheet];		
		this.#button = document.createElement('div');
		this.#button.classList.add("menu_btn");
		this.#button.dataset["clicked"] = false;
		this.#button.appendChild(document.createElement("div"));
        let container = document.createElement('div'); 
		container.classList.add('container');
		container.appendChild(this.#button);
		
		this.#shadowRoot.appendChild(container);
		let parentStyle = getComputedStyle(this.#shadowRoot.host);
		this.#shadowRoot.host.style.setProperty('--default-bg-color', parentStyle.backgroundColor);
		this.#shadowRoot.host.style.setProperty('--default-fg-color', parentStyle.color);
		
        if (this.hasAttribute("clicked")) 
		{
			let clicked = this.getAttribute("clicked");
			this.#button.dataset.clicked = (String(clicked).toLowerCase() === "true");
		}
		else
		{
			this.setAttribute("clicked", "false");
			this.#button.dataset.clicked = false;
		}

    }

    static get observedAttributes() {
        return ['clicked'];
    }

    connectedCallback() {

        if (!this.isConnected) return;
		
		this.#button.addEventListener("click", this.#menuClicked)
		this.addEventListener("click", (e) => {
				e.target.clicked = e.target.clicked == "true" ? "false" : "true";
			});
    }

    disconnectedCallback() 
	{
		this.#button.removeEventListener("click", this.menuClicked)
    }

    attributeChangedCallback(name, oldValue, newValue) {
		console.log("Attribute changed " + name);
        if (!this.isConnected) return;

        if (newValue == null) {
            this[name] = "";
            delete this[name];
            return;
        }
	}

	#menuClicked(e) {
		let menu = e.target.classList.contains("menu_btn") ? e.target : e.target.closest(".menu_btn");

		if (menu.dataset["clicked"] != undefined) {
			menu.addEventListener("animationend", 
				(e) => {
					   menu.classList.remove('menuClick');
					   } , {"once": true}
					   );
			menu.classList.add('menuClick');
		}
	}

    get clicked() {
        return this.#button.dataset.clicked;
    }
    set clicked(newValue) {
		this.#button.dataset.clicked = (String(newValue).toLowerCase() === "true");
        this.setAttribute("clicked", this.#button.dataset.clicked);
    }
}
customElements.define('abc-menu-button', ABCMenuButton);