document.addEventListener('DOMContentLoaded', () => {   
    // NAVIGATION SCROLLING EFFECT

    let navBar = document.querySelector('nav');
    navScroll(false)

    document.addEventListener('scroll', () => {
        navScroll(false)
    })

    function navScroll(result) {
        // result = if the user is currently viewing the menu page
        if (window.scrollY > 0 && !(result)) {
            navBar.style.boxShadow = '0 5px 20px rgba(190, 190, 190, 0.15)';
            navBar.style.backgroundColor = 'white'
        }
        else {
            navBar.style.boxShadow = 'none'
            navBar.style.backgroundColor = 'transparent'
        }
    }

    // MENU BAR

    let menuBar = document.querySelector('#menu-bar');
    let menuPage = document.querySelector('#menu-page');
    let html = document.querySelector('html');

    // Determine Screen Device: Desktop or Mobile
    let menuBarStyle = window.getComputedStyle(menuBar);
    let screenType = '';

    if (menuBarStyle.display === "flex") {
        screenType = "mobile"
    }
    else if (menuBarStyle.display === "none") {
        screenType = "desktop"
    }
    else {
        console.log("Error: Failed to identify screen type", screenType)
    }

    // Show/Hide Menu Page

    menuBar.addEventListener('click', () => {
        menuPage.classList.toggle('active');

        html.style.overflow = (menuPage.classList.contains('active')) ? "hidden" : "scroll"
        navScroll(menuPage.classList.contains('active'))
    })

    // PRODUCT CARDS DISPLAY

    let productContainerWidth = document.querySelector('.product-cards-container').offsetWidth;

    let rootStyles = getComputedStyle(html);
    let productCardWidth;
    let productCards;

    if (screenType === "desktop") {
        productCardWidth = parseInt(rootStyles.getPropertyValue('--product-card-width').replace('px', ''));
        productCardsPerRow = Math.floor(productContainerWidth / (productCardWidth + 5));
    }
    else if (screenType === "mobile") {
        productCardsPerRow = (html.offsetWidth > 430) ? 3 : 2
        productCardWidth = Math.floor((productContainerWidth / productCardsPerRow) - 10)
    }
    else {
        console.log("Error: Failed to set productCardsPerRow & productCardWidth")
    }

    let marginSpacing = (productContainerWidth - (productCardsPerRow * productCardWidth)) / (productCardsPerRow - 1);
    let lastElement = productCardsPerRow - 1;
    
    let sectionLastElement = []
    let productSections = document.querySelectorAll('.product-section');
    productSections.forEach((section) => {
        productCards = section.querySelectorAll('.product-card');
        
        for (let i = 0; i < productCardsPerRow; i++) {
            productCards[i].classList.add('active');

            if (i === lastElement) {
                productCards[i].style.marginRight = '0px';
            }
            else {
                productCards[i].style.marginRight = `${marginSpacing}px`;
            }
        }

        sectionLastElement[section.id] = lastElement;
    })

    // ADDING ITEMS TO WISHLIST

    let wishListCount;
    let heartButtons = document.querySelectorAll('.heart-button');

    heartButtons.forEach((button) => {
        button.addEventListener('click', () => {
            button.classList.toggle('active');
            
            wishListCount = accessCounter('.wishlist-link span');
            wishListCount.innerHTML = document.querySelectorAll('.heart-button.active').length;
        })
    })

    // ADDING ITEMS TO CART

    let cartCount;
    let cartButtons = document.querySelectorAll('.product-card .btn');
    
    cartButtons.forEach((button) => {
        button.addEventListener('click', () => {
            button.classList.toggle('active');
            
            let buttonString = button.innerHTML.trim();
            if (buttonString == "Add To Cart") {
                button.innerHTML = "Remove"
            }
            else if (buttonString == "Remove") {
                button.innerHTML = "Add To Cart"
            }
            else {
                console.log("Error: Adding items to cart failed.", buttonString, button.parentElement);
            }
            
            cartCount = accessCounter('.cart-link span');
            cartCount.innerHTML = document.querySelectorAll('.product-card .btn.active').length;
        })
    })

    function accessCounter(spanElement) {
        if (screenType === 'desktop') {
            return document.querySelector('#navbar-tools').querySelector(spanElement)
        }
        else if (screenType === 'mobile') {
            return document.querySelector('#menu-tools').querySelector(spanElement)
        }
        else {
            console.log("Error: accessCounter Function failed.")
        }
    }

    // SLIDESHOW

    let slideshowButtons = document.querySelectorAll('.slideshow-button');
    slideshowButtons.forEach((button) => {
        button.addEventListener('click', () => {
            let slideshowSection = button.parentElement.dataset.slideshow;
            let slideshowContainer = document.querySelector(`#product-section-${slideshowSection}`);
            let productCards = slideshowContainer.querySelectorAll('.product-card');
    
            let currentSection = `product-section-${slideshowSection}`;
            
            // Check if the button is for the previous or next action
            if (button.classList.contains('prev-button')) {
                // Prevent clicking if at the first item
                if (sectionLastElement[currentSection] <= 4) {
                    return; // Do nothing if already at the first item
                }
                sectionLastElement[currentSection]--; // Move to the previous item
            } 
            else if (button.classList.contains('next-button')) {
                // Prevent clicking if at the last item
                if (sectionLastElement[currentSection] >= (productCards.length - 1)) {
                    return; // Do nothing if already at the last item
                }
                sectionLastElement[currentSection]++; // Move to the next item
            } 
            else {
                console.log("Slideshow: Error occurred");
                return; // Exit if neither button is clicked
            }
    
            // Update the visibility of product cards
            for (let i = 0; i < productCards.length; i++) {
                if ((i <= sectionLastElement[currentSection]) && (i >= (sectionLastElement[currentSection] - (productCardsPerRow - 1)))) {
                    productCards[i].classList.add('active');
    
                    if (i === sectionLastElement[currentSection]) {
                        productCards[i].style.marginRight = '0px';
                    } else {
                        productCards[i].style.marginRight = `${marginSpacing}px`;
                    }
                } else {
                    productCards[i].classList.remove('active');
                    productCards[i].style.marginRight = '0px';
                }
            }
        });
    });
})