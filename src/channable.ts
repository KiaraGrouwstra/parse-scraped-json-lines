import * as R from "ramda";
import { doJL } from ".";

const path = R.map(R.concat("/media/tycho/Drogon/Coding/python/tutorial/"), {
    in: "results/coolblue_extracted.jl",
    out: "results/coolblue_channable.jl",
});

doJL(path,
    (o: any) => {
        const by = (k: string, v: string, x: string) => R.pipe(R.when(Boolean, R.find(R.propEq(k, x))), R.prop(v) as (o: {} | undefined) => any);
        const getSpec = (spec: string) => R.pipe(R.prop('single_specs') as (o: {} | undefined) => any, by('category', 'specs', 'Product'), by('k', 'v', spec));

        const id = (o._url.match(/\d+/) as [string])[0];
        const domain = "MYDOMAIN.nl";
        const url = o._url.replace("coolblue.nl", domain);
        const date = "2017-11-14";
        const end_date = "2017-12-31";
        const img = (imgId: string) => `https://www.coolblue.nl/product/${id}/?imageId=${imgId}`;

        return R.pipe(
            R.prop('_body') as (o: {} | undefined) => any,
            (x: any) => ({
                // images:
                image_link: img(x.images[0]),
                additional_image_link: img(x.images[1]),

                // urls:
                link: url,
                // adwords_redirect: url,

                // id stuff:
                id,
                sku: id,
                model_code: id,
                item_model_id: id,
                variant_code: id,
                item_group_id: id,

                // semantic:
                brand: getSpec('Merk')(x),
                // manufacturer: brand,
                mpn: getSpec('Fabrikantcode')(x),
                product_type: x.menu_cats[1].title, // Home > Women > Dresses > Maxi Dresses

                // price stuff:
                price: x.price,
                price_old: x.originalPrice || null,
                sale_price: x.originalPrice ? x.price : null,

                // misc:
                availability: x.availability ? "in stock" : "out of stock",
                title: x.title,
                description: x.text,
                energy_efficiency_class: x.energy_efficiency_class || null,
            }),

            // R.merge({
            //     // identifiers:
            //     shop_id: 0,
            //     identifier_exists: "no", // GTIN and brand, or, MPN and brand
            //     // ean: null, // 4006381333930
            //     // gtin: null, // 3234567890126
            //     // isbn: null,

            //     // categories:
            //     google_product_category: "Electronics", // Apparel & Accessories > Clothing
            //     // additional_product_type: null, // Home > Women > Dresses > Maxi Dresses
            //     product_category: "TRUE", // show category?
            //     product_subcategory: "FALSE",
            //     product_subsubcategory: "FALSE",

            //     // terms:
            //     condition: "new",
            //     currency: "EUR",
            //     unit_pricing_base_measure: "pcs",
            //     unit_pricing_measure: "1pcs",
            //     stock: 3,

            //     // shipping:
            //     country: "NL",
            //     pickup_costs: 0.0,
            //     delivery_period: 1,
            //     shipping_weight: "0 kg",
            //     shipping: {
            //         country: "NL",
            //         price: 0.0,
            //         region: "ZH",
            //         service: "DHL",
            //     },

            //     // dates:
            //     date,
            //     start_date: date,
            //     sale_price_effective_date: date,
            //     end_date,
            //     expiration_date: end_date,

            //     // // adwords:
            //     // promotion: "OPENING",
            //     // excluded_destination: null,
            //     // adwords_grouping: null, // T-shirts
            //     // adwords_labels: null, // cotton, pre-shrunk

            //     // // nulls:
            //     // adult: "no",
            //     // gender: "unisex",
            //     // multipack: null,
            //     // age_group: null,
            //     // material: null,
            //     // color: null,
            //     // pattern: null,
            //     // size: null,
            // }),
            JSON.stringify,
        )(o);
    }
);
