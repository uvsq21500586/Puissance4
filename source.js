//Le jeu puissance 4 est constitué d'une grille de 7x6 cases à remplir avec des jetons rouges et jaunes pour essayer d'en aligner 4
//dimensions
const rayonjeton = 15;
const espace = 10;
const longueur = espace + 7 * (rayonjeton * 2 + espace);
const hauteur = espace + 6 * (rayonjeton * 2 + espace);

//tour indique quel joueur a la main: 0->rouge, 1->jaune
var tour = 0;
//pieces décrit les pièces du plateau: 0=vide, 1=rouge, 2=jaune
var pieces = [];
for (let i = 0; i < 6; i++) {
    pieces[i] = [];
    for (let j = 0; j < 7; j++) {
        pieces[i][j] = 0;
    }
}
//piles représente les tailles des piles des pièces de chaque colonne
var piles = [];
for (let i = 0; i < 7; i++) {
    piles[i] = 0;
    var button = document.getElementById("b" + (i + 1));
    button.disabled = true;
}

function draw() {
    //dessine le jeu
    var canvas = document.getElementById("jeu");
    if (canvas.getContext) {
        var ctx = canvas.getContext("2d");
        //rectangle bleu foncé
        ctx.fillStyle = 'darkblue';
        ctx.fillRect(0, 0, longueur, hauteur);
        //les emplacements: vide->blanc, 1->rouge, 2->jaune
        for (let i = 0; i < 6; i++) {
            for (let j = 0; j < 7; j++) {
                if (pieces[i][j] == 0) {
                    ctx.fillStyle = 'white';
                } else if (pieces[i][j] == 1) {
                    ctx.fillStyle = 'red';
                } else {
                    ctx.fillStyle = 'yellow';
                }
                ctx.beginPath();
                ctx.moveTo((rayonjeton + espace) + (rayonjeton * 2 + espace) * j, (rayonjeton + espace) + (rayonjeton * 2 + espace) * i);
                ctx.arc((rayonjeton + espace) + (rayonjeton * 2 + espace) * j, (rayonjeton + espace) + (rayonjeton * 2 + espace) * i, rayonjeton, 0, Math.PI * 2, true);
                ctx.fill();
            }
        }


    }
}

function initialiser() {
    //nouvelle partie: on initialise le jeu
    tour = 0;
    pieces = [];
    for (let i = 0; i < 6; i++) {
        pieces[i] = [];
        for (let j = 0; j < 7; j++) {
            pieces[i][j] = 0;
        }
    }
    piles = [];
    for (let i = 0; i < 7; i++) {
        piles[i] = 0;
        // on pourra cliquer sur n'importe quel bouton car les piles sont vides
        var button = document.getElementById("b" + (i + 1));
        button.disabled = false;
    }
    //dessin
    draw();
    //message + règles pour gagner la partie
    alert("Nouvelle partie!\n Cliquez sur l'un des 7 boutons pour placer un jeton et essayez d'en aligner 4 avant votre adversaire pour gagner.");
    var tourjoueur = document.getElementById("tour");
    tourjoueur.innerText = "tour: joueur " + (tour + 1);
    tourjoueur.style.color = 'red';
}

function jouer(n) {
    //n = colonne choisie par le joueur
    console.log(n);
    pieces[5 - piles[n]][n] = tour + 1;
    draw();
    piles[n]++;
    if (piles[n] == 6) {
        //colonne pleine: on rend le bouton inaccessible
        var button = document.getElementById("b" + (n+1));
        button.disabled = true;
    }
    //vérifier si c'est la fin de la partie
    finPartie(6 - piles[n], n);

}
function finPartie(ligne, colonne) {
    //vérifier si on est en fin de partie
    if (coupgagnant(ligne, colonne)) {
        //le joueur vient d'aligner 4 jetons de sa couleur
        alert("Le joueur " + (tour + 1) + " a gagné!");
        for (let i = 0; i < 7; i++) {
            var button = document.getElementById("b" + (i + 1));
            button.disabled = true;
        }
    } else if (jeubloque()) {
        alert("Match nul car le jeu est bloqué");
        //changement de tour même si c'est bloqué
        tour = 1 - tour;
        var tourjoueur = document.getElementById("tour");
        tourjoueur.innerText = "tour: joueur " + (tour + 1);
        if (tour == 0) {
            tourjoueur.style.color = 'red';
        } else {
            tourjoueur.style.color = 'yellow';
        }
    } else {
        //changement de tour, le jeu continue
        tour = 1 - tour;
        var tourjoueur = document.getElementById("tour");
        tourjoueur.innerText = "tour: joueur " + (tour + 1);
        if (tour == 0) {
            tourjoueur.style.color = 'red';
        } else {
            tourjoueur.style.color = 'yellow';
        }
    }
}

function jeubloque() {
    //vérifier si la partie est bloquée (donc si les 7 piles sont complètes)
    var bloque = true;
    for (let i = 0; i < 7; i++) {
        if (piles[i] < 6) {
            // il reste au moins un emplacement pour placer un jeton
            bloque = false;
        }
    }
    return bloque;
}
function coupgagnant(ligne, colonne) {
    //permet de vérifier si le nouveau jeton permet d'avoir 4 jetons de la même couleur alignés à partir du jeton placé en [ligne,colonne]
    //verticalement (comme on a des piles, on sait que les emplacements au-dessus sont vides, donc on ne regarde que les jetons en-dessous)
    let couleurjeton = pieces[ligne][colonne];
    for (let i = ligne; i < ligne + 4; i++) {

        if (pieces[i][colonne] != couleurjeton) {
            //jeton adverse rencontré
            break;
        }
        if (i - ligne == 3) {
            //on a eu les 4 jetons de même couleur alignés verticalement
            console.log("ligne verticale");
            return true;
        }
        if (i == 5) {
            //on se retrouve tout en bas de la colonne
            break;
        }
    }
    //n et n2 permettent de compter le nombre de jetons de même couleur
    //horizontalement
    let n = 1;
    for (let i = colonne - 1; i >= 0 && i > colonne - 4; i--) {
        //direction gauche
        console.log("j=" + pieces[ligne][i]);
        if (pieces[ligne][i] != couleurjeton) {
            //jeton adverse rencontré
            break;
        } else {
            n++;
        }
    }
    let n2 = n;
    for (let i = colonne + 1; i < 7 && i <= colonne + (4 - n); i++) {
        //direction droite
        console.log("j=" + pieces[ligne][i]);
        if (pieces[ligne][i] != couleurjeton) {
            //jeton adverse rencontré
            break;
        } else {
            n2++;
        }
    }
    if (n2 == 4) {
        //on a eu les 4 jetons de même couleur alignés horizontalement
        console.log("ligne horizontale");
        return true;
    }
    //diagonnale montante
    n = 1;
    for (let i = 1; i <= colonne && i < 4 && i < (6 - ligne); i++) {
        //direction bas-gauche
        console.log("j=" + pieces[ligne + i][colonne - i]);
        if (pieces[ligne + i][colonne - i] != couleurjeton) {
            break;
        } else {
            n++;
        }
    }
    n2 = n;
    for (let i = 1; i <= (6 - colonne) && i <= (4 - n) && i <= ligne; i++) {
        //direction haut-droite
        console.log("j=" + pieces[ligne - i][colonne + i]);
        if (pieces[ligne - i][colonne + i] != couleurjeton) {
            break;
        } else {
            n2++;
        }
    }
    if (n2 == 4) {
        //on a eu les 4 jetons de même couleur alignés en diagonale montante
        console.log("ligne diagonale montante");
        return true;
    }
    //diagonnale descendante
    n = 1;
    for (let i = 1; i <= colonne && i < 4 && i <= ligne; i++) {
        //direction haut-gauche
        if (pieces[ligne - i][colonne - i] != couleurjeton) {
            break;
        } else {
            n++;
        }
    }
    n2 = n;
    for (let i = 1; i <= (6 - colonne) && i <= (4 - n) && i < (6 - ligne); i++) {
        //direction bas-droite
        if (pieces[ligne + i][colonne + i] != couleurjeton) {
            break;
        } else {
            n2++;
        }
    }
    if (n2 == 4) {
        //on a eu les 4 jetons de même couleur alignés en diagonale descendante
        console.log("ligne diagonale descendante");
        return true;
    }

    //Aucun alignement de 4 jetons donc le jeu continue
    console.log("continue");
    return false;
}
