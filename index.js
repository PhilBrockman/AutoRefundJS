function() {
    let observer = null;

    function startObserver() {
        if(observer !== null) return;

        observer = new MutationObserver((mutationsList) => {
            for(let mutation of mutationsList) {
                if(mutation.type === 'childList') {
                    const refundButton = Array.from(mutation.target.getElementsByTagName('button'))
                                          .find(button => button.textContent.trim() === 'Refund item');
                    if(refundButton) {
                        refundButton.click();
                        stopObserver();
                        setTimeout(findAndEditNonRefundedItem, 1000); // wait for possible DOM updates
                    }
                }
            }
        });
    }

    function stopObserver() {
        if(observer !== null) {
            observer.disconnect();
            observer = null;
        }
    }

    function findAndEditNonRefundedItem() {
        const allItems = Array.from(document.getElementsByTagName('span'))
                             .filter(span => span.textContent.trim().startsWith('If out of stock,'));

        const nonRefundedItems = allItems.filter(item => !item.nextSibling || !item.nextSibling.textContent.includes('refund item'));

        if(nonRefundedItems.length === 0) {
            console.log('No more non-refunded items.');
            return;
        }

        const parentDiv = nonRefundedItems[0].parentNode.parentNode;
        const editButton = Array.from(parentDiv.getElementsByTagName('button'))
                               .find(button => button.textContent.trim().includes('Edit'));

        if(editButton) {
            startObserver();
            const config = { childList: true, subtree: true };
            observer.observe(document.body, config);
            editButton.click();
        } else {
            console.log('Could not find edit button for non-refunded item.');
        }
    }

    findAndEditNonRefundedItem();
}
