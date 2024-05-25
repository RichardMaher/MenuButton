export class ABCMenuButton extends HTMLElement 
{
	#button;
	#internals;
	
    constructor() {
        super();

        this.attachShadow({ mode: 'open' });
		this.#internals = this.attachInternals();
		this.#internals.ariaRole = "menu";
		
		let link = document.createElement('link');
		link.href = "./menu-button.css";
		link.rel = "stylesheet";
		link.type = "text/css";
		this.shadowRoot.appendChild(link);
				
		this.#button = document.createElement('div');
		this.#button.classList.add("menu_btn");
		this.#button.dataset["pressed"] = false;
		this.#button.appendChild(document.createElement("div"));
		
        let container = document.createElement('div'); 
		container.classList.add('container');
		container.appendChild(this.#button);
		
		this.shadowRoot.appendChild(container);
		let parentStyle = getComputedStyle(this.shadowRoot.host);
		this.shadowRoot.host.style.setProperty('--default-bg-color', parentStyle.backgroundColor);
		this.shadowRoot.host.style.setProperty('--default-fg-color', parentStyle.color);
				
		this.setAttribute("aria-disabled", this.hasAttribute("disabled"));
		
		this.#button.dataset.pressed = this.hasAttribute("pressed");
		
		this.setAttribute("aria-pressed", this.#button.dataset.pressed);
		
		this.#button.addEventListener("click", (e) => {
			let menu = e.target.classList.contains("menu_btn") ? e.target : e.target.closest(".menu_btn");
			if (this.hasAttribute("disabled")) {
				e.stopPropagation();
				e.preventDefault();
				return;
			}
			
			if (menu.dataset["pressed"] != undefined) {
				menu.addEventListener("animationend", 
					(e) => {
						   menu.classList.remove('menuClick');
						   }, {"once": true}
						   );
				menu.classList.add('menuClick');
				if (menu.dataset.pressed == "false") {
					this.setAttribute("pressed", "");
				} else {
					this.removeAttribute("pressed");
				}
			}
		});
    }

    static get observedAttributes() {
        return ['pressed', 'disabled'];
    }

    connectedCallback() {

        if (!this.isConnected) return;
		
		let parentStyle = getComputedStyle(this.shadowRoot.host);
		
		if (parentStyle.backgroundColor.replace(/ /g,"") != "rgba(0,0,0,0)")
			this.shadowRoot.host.style.setProperty('--default-bg-color', parentStyle.backgroundColor);
		
		this.shadowRoot.host.style.setProperty('--default-fg-color', parentStyle.color);
    }

    disconnectedCallback() 
	{
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (!this.isConnected) return;
		
		console.log("Change " + name + " value " + newValue);

		switch	(name) {
			case	"pressed":
				if (this.hasAttribute(name)) {
					this.setAttribute("aria-"+name, "true");
					this.#button.dataset[name] = true;
				} else {
					this.#button.dataset[name] = false;
					this.setAttribute("aria-"+name, "false");
				}
				break;
			case	"disabled":
				if (this.hasAttribute(name)) {
					this.setAttribute("aria-"+name, "true");
				} else {
					this.setAttribute("aria-"+name, "false");
				}
				break;
			default:
				throw new Error("Unknown attribute modified " + name);
		}
	}

    get pressed() {
        return this.hasAttribute("pressed");
    }
	
    set pressed(newValue) {
		if (String(newValue).toLowerCase() !== "true") {
			this.removeAttribute("pressed")
		} else {
			this.setAttribute("pressed", "");
		}
    }
	
    get disabled() {
        return this.hasAttribute("disabled");
    }
	
    set disabled(newValue) {
		if (String(newValue).toLowerCase() !== "true") {
			this.removeAttribute("disabled")
		} else {
			this.setAttribute("disabled", "");
		}
    }
}
customElements.define('abc-menu-button', ABCMenuButton);