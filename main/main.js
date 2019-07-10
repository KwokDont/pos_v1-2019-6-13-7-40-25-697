'use strict';

const isBarcodeExist = barcodes => {
    let flag = true;
    let ItemList = loadAllItems();
    let barcodeList = ItemList.map(item => item['barcode']);
    barcodes.forEach(barcode => {
        let index = barcode.indexOf('-');
        let subCode = '';
        if(index > -1){
            subCode = barcode.substring(0,index);
            if (barcodeList.indexOf(subCode) === -1) {
                flag = false;
            }
        }else{
            if (barcodeList.indexOf(barcode) === -1) {
                flag = false;
            }
        }
    });
    return flag;
}

const drawReceipt = barcodes => {
    const itemList = loadAllItems();
    const promotions = loadPromotions();
    let barcodeList = promotions[0].barcodes
    let nameList = itemList.map(item => item.name);
    let total = 0;
    let offerPrice = 0;
    let result = '***<没钱赚商店>收据***\n';
    let cart = getCart(barcodes, itemList);
    cart.forEach(item => {
        let index = nameList.indexOf(item.name);
        let barcode = itemList[index].barcode;
        let offerNum = 0;
        let offer = 0;
        if(barcodeList.indexOf(barcode) > -1){
            if(item.num >= 3){
                offerNum = item.num / 3;
            }
            offer = Math.floor(offerNum) * item.price;
            offerPrice += offer;
            item.totalprice -= offer;
        }
        result += '名称：' + item.name + '，数量：' + item.num + item.unit + '，单价：' + item.price.toFixed(2) + '(元)，小计：' + item.totalprice.toFixed(2) + '(元)\n';
        total += item.price * item.num - offer;
        offerNum = 0;
    });
    result += '----------------------\n总计：' + total.toFixed(2) + '(元)\n节省：' + offerPrice+'(元)\n**********************';
    return result;
}

const getCart = (barcodes, itemList) => {
    let cart = new Array();
    barcodes.forEach(barcode => {
        itemList.forEach(menuItem => {
            let nameList = cart.map(item => item['name']);
            let subCode = '';
            let subNum = 0;
            let pos = barcode.indexOf('-');
            if(pos > -1){
                subCode = barcode.substring(0,pos);
                subNum = Number(barcode.substring(pos + 1,barcode.length));
            }
            if (barcode == menuItem['barcode'] || subCode == menuItem['barcode']) {
                let index = nameList.indexOf(menuItem['name']);
                if (index > -1) {
                    if(subNum > 0){
                        cart[index]['num'] += subNum;
                        cart[index]['totalprice'] += subNum * menuItem['price'];
                    }else{
                        cart[index]['num']++;
                        cart[index]['totalprice'] += menuItem['price'];
                    }
                } else {
                    if(subNum > 0){
                        cart.push({ 'name': menuItem['name'], 'price': menuItem['price'], 'num': subNum, 'unit': menuItem['unit'], 'totalprice': subNum * menuItem['price'] }); 
                    }else{
                        cart.push({ 'name': menuItem['name'], 'price': menuItem['price'], 'num': 1, 'unit': menuItem['unit'], 'totalprice': menuItem['price'] });
                    }
                }
            }
        });
    });
    return cart;
}

const printReceipt = inputs => {
    if (!isBarcodeExist(inputs)) {
        console.log("[ERROR]:some barcodes doesn't exist!");

    } else {
        console.log(drawReceipt(inputs));
    }
}

