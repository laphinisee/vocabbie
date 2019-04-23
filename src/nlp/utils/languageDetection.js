const {Translate} = require('@google-cloud/translate');

const translate = new Translate();

function detectLanguage(text) {
	return translate.detect(text);
}

function validateText(text, threshold) {
	return detectLanguage(text).then(result => {
		return result[0]
	})
}

module.exports.detectLanguage = detectLanguage;

// validateText('hello how are you?')
// validateText("Hawaii, a U.S. state, is an isolated volcanic archipelago in the Central Pacific. Its islands are renowned for their rugged landscapes of cliffs, waterfalls, tropical foliage and beaches with gold, red, black and even green sands. Of the 6 main islands, Oahu has Hawaii’s biggest city and capital, Honolulu, home to crescent Waikiki Beach and Pearl Harbor's WWII memorials.")
// validateText("ハワイ島、マウイ島、オアフ島、カウアイ島、モロカイ島、ラナイ島、ニイハウ島、カホオラウェ島の8つの島と100以上の小島からなるハワイ諸島のうち、ミッドウェー環礁を除いたすべての島が、ハワイ州に属している。北西ハワイ諸島の北西端からハワイ諸島の南東端のハワイ島まで、全長1,500マイル (2,400 km) にわたっている。州全体が島だけで構成されることではアメリカ合衆国で唯一の州である。アメリカ合衆国本土の南西、日本の南東、オーストラリアの北東と、太平洋の中央に位置し、地理的にも民族的にも近いポリネシアでは最も北にある列島で構成されている。その自然の多様な景観、暖かい熱帯性気候、豊富な公共の海浜と大洋に取り囲まれていること、および活火山の活動があることで、観光客、サーファー、生物学者、火山学者などに人気のある目的地になっている。独特の文化がある他に太平洋の中心にあることで、北アメリカやアジアの影響も多く受けている。130万人を超える人口の他に常に観光客やアメリカ軍軍事関係者が滞在している。")
// validateText("ハワイ島、マウイ島、オアフ島、カウアイ島、モロカイ島、ラナイ島、ニイハウ島、カホオラウェ島の8つの島と100以上の小島からなるハワイ諸島のうち、ミッドウェー環礁を除いたすべての島が、ハワイ州に属している。北西ハワイ諸島の北西端からハワイ諸島の南東端のハワイ島まで、全長1,500マイル (2,400 km) にわたっている。州全体が島だけで構成されることではアメリカ合衆国で唯一の州である。Hawaii, a U.S. state, is an isolated volcanic archipelago in the Central Pacific. Its islands are renowned for their rugged landscapes of cliffs, waterfalls, tropical foliage and beaches with gold, red, black and even green sands. Of the 6 main islands, Oahu has Hawaii’s biggest city and capital, Honolulu, home to crescent Waikiki Beach and Pearl Harbor's WWII memorials. アメリカ合衆国本土の南西、日本の南東、オーストラリアの北東と、太平洋の中央に位置し、地理的にも民族的にも近いポリネシアでは最も北にある列島で構成されている。その自然の多様な景観、暖かい熱帯性気候、豊富な公共の海浜と大洋に取り囲まれていること、および活火山の活動があることで、観光客、サーファー、生物学者、火山学者などに人気のある目的地になっている。独特の文化がある他に太平洋の中心にあることで、北アメリカやアジアの影響も多く受けている。130万人を超える人口の他に常に観光客やアメリカ軍軍事関係者が滞在している。 ")