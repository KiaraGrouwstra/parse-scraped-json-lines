import * as R from "ramda";
import { doJL } from ".";

const path = R.map(R.concat("/media/tycho/Drogon/Coding/python/tutorial/"), {
    in: "results/coolblue_extracted.jl",
    out: "results/coolblue_shopify.csv",
});

doJL(path,
    (o: any) => {
        const by = (k: string, v: string, x: string) => R.pipe(R.when(Boolean, R.find(R.propEq(k, x))), R.prop(v) as (o: {} | undefined) => any);
        const getSpec = (spec: string) => R.pipe(R.prop('single_specs') as (o: {} | undefined) => any, by('category', 'specs', 'Product'), by('k', 'v', spec));

        const id = (o._url.match(/\d+/) as [string])[0];
        const slug = (o._url.match(/\/([^/]+)\.html/) as [string])[1];
        // const domain = "MYDOMAIN.nl";
        // const url = o._url.replace("coolblue.nl", domain);
        // const date = "2017-11-14";
        // const end_date = "2017-12-31";
        const img = (imgId: string) => `https://www.coolblue.nl/product/${id}/?imageId=${imgId}`;

        return R.pipe(
            R.prop('_body') as (o: {} | undefined) => any,
            (x: any) => {
                const specs = R.path(['single_specs', 0, 'specs'], x); // as (o: {} | undefined) => any
                const cat = x.menu_cats[1].title;
                // Handle,Title,Body (HTML),Vendor,Type,Tags,Published,Option1 Name,Option1 Value,Option2 Name,Option2 Value,Option3 Name,Option3 Value,Variant SKU,Variant Grams,Variant Inventory Tracker,Variant Inventory Qty,Variant Inventory Policy,Variant Fulfillment Service,Variant Price,Variant Compare At Price,Variant Requires Shipping,Variant Taxable,Variant Barcode,Image Src,Image Alt Text,Gift Card,Google Shopping / MPN,Google Shopping / Age Group,Google Shopping / Gender,Google Shopping / Google Product Category,SEO Title,SEO Description,Google Shopping / AdWords Grouping,Google Shopping / AdWords Labels,Google Shopping / Condition,Google Shopping / Custom Product,Google Shopping / Custom Label 0,Google Shopping / Custom Label 1,Google Shopping / Custom Label 2,Google Shopping / Custom Label 3,Google Shopping / Custom Label 4,Variant Image,Variant Weight Unit
                // example-t-shirt,Example T-Shirt,,Acme,Shirts,mens t-shirt example,TRUE,Title,"Lithograph - Height: 9"" x Width: 12""",,,,,,3629,,1,deny,manual,25,,TRUE,TRUE,,http://cdn.shopify.com/s/images/shopify_shirt.png?e6948ca4d9028f9e734b8202cc472e3b89aae0f3,A black t-shirt with the shopify logo,FALSE,7X8ABC910,Adult,Unisex,Apparel & Accessories > Clothing,Our awesome T-shirt in 70 characters or less.,A great description of your products in 160 characters or less,T-shirts,"cotton, pre-shrunk",used,FALSE,,,,,,,
                return [
                    // Handle: example-t-shirt
                    slug,
                    // Title: Example T-Shirt
                    x.title,
                    // Body (HTML)
                    x.text,
                    // Vendor: Acme
                    getSpec('Merk')(x),
                    // Type: Shirts
                    cat,
                    // Tags: mens t-shirt example
                    x.title,
                    // Published: TRUE
                    "TRUE",
                    // Option1 Name: Title
                    R.path([0, 'k'], specs),
                    // Option1 Value: "Lithograph - Height: 9"" x Width: 12"""
                    R.path([0, 'v'], specs),
                    // Option2 Name
                    R.path([1, 'k'], specs),
                    // Option2 Value
                    R.path([1, 'v'], specs),
                    // Option3 Name
                    R.path([2, 'k'], specs),
                    // Option3 Value
                    R.path([2, 'v'], specs),
                    // Variant SKU
                    id,
                    // Variant Grams: 3629
                    0,
                    // Variant Inventory Tracker
                    null,
                    // Variant Inventory Qty: 1
                    1,
                    // Variant Inventory Policy: deny
                    "deny",
                    // Variant Fulfillment Service: manual
                    "manual",
                    // Variant Price: 25
                    x.price,
                    // Variant Compare At Price
                    x.price,
                    // Variant Requires Shipping: TRUE
                    "TRUE",
                    // Variant Taxable: TRUE
                    "TRUE",
                    // Variant Barcode
                    null,
                    // Image Src: http://cdn.shopify.com/s/images/shopify_shirt.png?e6948ca4d9028f9e734b8202cc472e3b89aae0f3
                    img(x.images[0]),
                    // Image Alt Text: A black t-shirt with the shopify logo
                    x.title,
                    // Gift Card: FALSE
                    "FALSE",
                    // Google Shopping / MPN: 7X8ABC910
                    getSpec('Fabrikantcode')(x) || id,
                    // Google Shopping / Age Group: Adult
                    "Adult",
                    // Google Shopping / Gender: Unisex
                    "Unisex",
                    // Google Shopping / Google Product Category: Apparel & Accessories > Clothing
                    "Electronics",
                    // SEO Title: Our awesome T-shirt in 70 characters or less.
                    x.title,
                    // SEO Description: A great description of your products in 160 characters or less
                    x.text,
                    // Google Shopping / AdWords Grouping: T-shirts
                    cat,
                    // Google Shopping / AdWords Labels: "cotton, pre-shrunk"
                    x.title,
                    // Google Shopping / Condition: used
                    "new",
                    // Google Shopping / Custom Product: FALSE
                    "FALSE",
                    // Google Shopping / Custom Label 0
                    null,
                    // Google Shopping / Custom Label 1
                    null,
                    // Google Shopping / Custom Label 2
                    null,
                    // Google Shopping / Custom Label 3
                    null,
                    // Google Shopping / Custom Label 4
                    null,
                    // Variant Image
                    null,
                    // Variant Weight Unit
                    "kg",
                ].map((v: any) => v ? JSON.stringify(v) : '').join(','); // v || // .replace(/\n/g, '</br>')
            }
        )(o);
    }
);
