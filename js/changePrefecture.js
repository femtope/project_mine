
//Populating Prefecture by Region
var lgasbystate = {
    Boké: [" ", "Boffa", "Boké", "Fria", "Gaoual", "Koundara"],
    Conakry: [" ", "Conakry"],
    Faranah: [" ", "Dabola", "Dinguiraye", "Faranah", "Kissidougou"],
    Kankan: [" ", "Kankan", "Kerouana", "Kouroussa", "Mandiana", "Siguiri"],
    Kindia: [" ", "Coyah", "Dubreka", "Forecariah", "Kindia", "Telemele"],
    Labe: [" ", "Koubia", "Labe", "Lelouma", "Mali", "Tougue"],
    Mamou: [" ", "Dalaba", "Mamou", "Pita"],
    Nzérékoré: [" ", "Beyla", "Gueckedou", "Lola", "Macenta", "Nzérékoré", "Yamou"]
}

function changecat(value) {
        if (value.length == 0) document.getElementById("prefecture_scope").innerHTML = "<option></option>";
        else {
            var catOptions = "";
            for (categoryId in lgasbystate[value]) {
                catOptions += "<option>" + lgasbystate[value][categoryId] + "</option>";
            }
            document.getElementById("prefecture_scope").innerHTML = catOptions;
        }
}
