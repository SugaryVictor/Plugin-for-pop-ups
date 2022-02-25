class PopUp {
    constructor(options) {
		let defaultOptions = {
			isOpen: () => {},
			isClose: () => {},
		};
		this.options = Object.assign(defaultOptions, options);
		this.popUp = document.querySelector('.pop-up');
		this.speed = false;
		this.animation = false;
		this.isOpen = false;
		this.popUpContainer = false;
		this.prevActiveElement = false;
		this.fixBlocks = document.querySelectorAll('.fix-block');
		this.events();
    }

    events() {
        if ( this.popUp) {
            document.addEventListener('click', function(e){
                const clickedElement = e.target.closest('[data-path]');
                if (clickedElement) {
                    let target = clickedElement.dataset.path;
                    let animation = clickedElement.dataset.animation;
                    let speed = clickedElement.dataset.speed;
                    this.animation = animation ? animation : 'fade';
                    this.speed = speed ? +speed : 300;
                    this.popUpContainer = document.querySelector(`[data-target="${target}"]`);
                    this.open();
                    return; 
                }

                if (e.target.closest('.pop-up-close')) {
                    this.close();
                    return;
                }
            }.bind(this));
            
			window.addEventListener('keydown', function(e) {
				if (e.keyCode == 27) {
					if (this.isOpen) {
						this.close();
					}
				}

			}.bind(this));
            
            this.popUp.addEventListener('click', function(e) {
				if (!e.target.classList.contains('pop-up__container') && !e.target.closest('.pop-up__container') && this.isOpen) {
					this.close();
				}
			}.bind(this));
        }
    }

    open() {
        this.prevActiveElement = document.activeElement;
    
        this.popUp.style.setProperty('--transactionTime', `${this.speed / 1000}s`);
        this.popUp.classList.add('open');
        this.disableScroll();
    
        this.popUpContainer.classList.add('pop-up-open');
        this.popUpContainer.classList.add(this.animation);
    
        setTimeout(()=> {
            this.options.isOpen(this);
            this.popUpContainer.classList.add('animate-open');
            this.isOpen = true;
        }, this.speed);
    }
    
	close() {
		if (this.popUpContainer) {
			this.popUpContainer.classList.remove('animate-open');
			this.popUpContainer.classList.remove(this.animation);
			this.popUp.classList.remove('open');
			this.popUpContainer.classList.remove('pop-up-open');

			this.enableScroll();
			this.options.isClose(this);
			this.isOpen = false;
		}
	}

    
    disableScroll() {
        let pagePosition = window.scrollY;
        this.lockPadding();
        document.body.classList.add('disable-scroll');
        document.body.dataset.position = pagePosition;
        document.body.style.top = -pagePosition + 'px';
    }
    enableScroll(){
        let pagePosition = parseInt(document.body.dataset.position, 10);
        this.unlockPadding();
        document.body.style.top = 'auto';
        document.body.classList.remove('disable-scroll');
        window.scroll({ top: pagePosition, left: 0 });
        document.body.removeAttribute('data-position');
    }
    lockPadding() {		
        let paddingOffset = window.innerWidth - document.body.offsetWidth + 'px';
        this.fixBlocks.forEach((el) => {
            el.style.paddingRight = paddingOffset;
        });
        document.body.style.paddingRight = paddingOffset;
    }
    unlockPadding() {
        this.fixBlocks.forEach((el) => {
            el.style.paddingRight = '0px';
        });
        document.body.style.paddingRight = '0px';
    }
}
const popUp = new PopUp({
    isOpen: () => {
        console.log("OPEN");
    },
    isClose: () => {
        console.log("CLOSE");
    }
});