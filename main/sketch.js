let fps = 0;
let touchTargets = [];
let activeGame;

let SCREEN_WIDTH = 2160;
let SCREEN_HEIGHT = 3840;

let button1;
let button2;
let button3;

let buttonRo, buttonEn;

let buttonGameTimeline, buttonGameMemory, buttonGamePuzzle, buttonGameColaj;

let tl = {};

let mem = {};

let puz = {};

let col = {};

let LANG_RO = "ro";
let LANG_EN = "en";
let language = LANG_RO;

let IDLE_TIMEOUT_INTERACTION = 6000;
let IDLE_TIMEOUT_NO_INTERACTION = 1000; // faster timeout if no interaction for a longer time.
let idleTimer = IDLE_TIMEOUT_NO_INTERACTION;

let menu = {
    isVisible: false,
    fixedPosition: 1100,
    currentPos: 0,

    // opening animation vars
    currentValue: 0,
    incrementAmount: 0.001,

    // active menu option
    currentOption: 0, // 0=language, 1=games, 2=info
}

// +++++ PRELOADED content.
let loadedImages = [];
let restartTimelineButtonRo;
let restartTimelineButtonEn;
let fontNotoMedium;
let fontNotoLight;
let fontZebrra;

let menuInfo, menuLanguage_ro, menuGames_ro;
let menuLanguage_en, menuGames_en;
let langRo, langEn;

let imgGameTimeline, imgGameMemory, imgGamePuzzle, imgGameColaj;
let imgGameTimeline_en, imgGameMemory_en, imgGamePuzzle_en, imgGameColaj_en;
let infoRo, infoEn;

let timelineBg, memoryBg, collageBg, timelineNextButton_ro, timelineNextButton_en, puzzleNextButton_ro, puzzleNextButton_en, puzzleBg;

let collageImg1, collageImg2, collageImg3, collageImg1Small, collageImg2Small, collageImg3Small, collageAreas;
let collagePiece1, collagePiece2, collagePiece3;

let puzLevel12_ro_active, puzLevel12_ro_inactive, puzLevel30_ro_active, puzLevel30_ro_inactive, puzLevel20_ro_active, puzLevel20_ro_inactive;
let puzLevel12_en_active, puzLevel12_en_inactive, puzLevel30_en_active, puzLevel30_en_inactive, puzLevel20_en_active, puzLevel20_en_inactive;
let puzButtonBg_ro, puzButtonBg_en;

let puzzle12Images = [];
let puzzle20Images = [];
let puzzle30Images = [];
let puzzle12Thumbs = [];
let puzzle20Thumbs = [];
let puzzle30Thumbs = [];

// -------------------------------

function preload() {
    menuInfo = loadImage('img/menu/info_button.png');
    menuLanguage_ro = loadImage('img/menu/language_en.png');
    menuGames_ro = loadImage('img/menu/games_ro.png');
    menuLanguage_en = loadImage('img/menu/language_ro.png');
    menuGames_en = loadImage('img/menu/games_en.png');

    langRo = loadImage('img/menu/lang_ro.png');
    langEn = loadImage('img/menu/lang_en.png');

    imgGameTimeline = loadImage('img/menu/game_timeline_ro.png');
    imgGameMemory = loadImage('img/menu/game_memory_ro.png');
    imgGamePuzzle = loadImage('img/menu/game_puzzle_ro.png');
    imgGameColaj = loadImage('img/menu/game_colaj_ro.png');

    imgGameTimeline_en = loadImage('img/menu/game_timeline_en.png');
    imgGameMemory_en = loadImage('img/menu/game_memory_en.png');
    imgGamePuzzle_en = loadImage('img/menu/game_puzzle_en.png');
    imgGameColaj_en = loadImage('img/menu/game_colaj_en.png');

    infoRo = loadImage('img/menu/info_ro.png');
    infoEn = loadImage('img/menu/info_en.png');

    fontNotoMedium = loadFont('font/NotoSans-Medium.ttf');
    fontNotoLight = loadFont('font/NotoSans-Light.ttf');
    fontZebrra = loadFont('font/zebrra.regular.ttf');

    // memory images below.
    // keep a unique ID of the image to keep track of the displayed images and not display them anymore in the current game.
    // [image path, image unique id, image title, image description, image year, correct sport id]
    loadedImages.push([loadImage('memoryImg/main_images/1.png'), '1',
        {
            "ro": ["Adolf Haltrich", 
                    "Titlul de campion al Transilvaniei pentru sezonul 1898/1899 la ciclism,\n"+
                    "cursa de 50 km., a fost câștigat de Adolf Haltrich la concursul de la \n"+
                    "Brașov, organizat de „Asociația bicicliștilor germani din \n"+
                    "Transilvania”, pe 23 august 1898. Fotografia este o „amintirea \n"+
                    "prietenească” a cursei de 60 kilometri Cluj – Dej ținută pe 23 mai 1897,\n"+
                    "cu cicliștii Haltrich, Barabás, Appel, Szentpétery.", 
                    "1899"],
            "en": ["Adolf Haltrich", 
                    "Adolf Haltrich won the title of Transylvanian champion for the 1898/1899\n"+
                    "season in cycling, 50 km race, at the competition organized in Brașov by\n"+
                    "the \"Association of German Cyclists from Transylvania\" on August 23, \n"+
                    "1898. The photo is a \"friendly souvenir\" from the 60 km race between\n"+
                    "Cluj and Dej held on May 23, 1897, with cyclists Haltrich, Barabás, \n"+
                    "Appel, Szentpétery.", 
                    "1899"]
        }, 9]);
    loadedImages.push([loadImage('memoryImg/main_images/2.png'), '2',
        {
            "ro": ["Miți de Lemeny", 
                    "Prima campioană a Brașovului. S-a întâmplat la patinaj, în concursul\n"+
                    "ținut la Viena, în 1913. În 1925, între 23 și 25 ianuarie, pe patinoarul\n"+
                    "Brașovia au avut loc campionatele naționale de hochei pe gheață și \n"+
                    "campionatele naționale de patinaj artistic. În concursul „damelor”,\n"+
                    "premiul I a fost câștigat de doamna Maria Popp-Lemeny. În fotografie, \n"+
                    "Maria („Miți”) Victoria de Lemény, 1910 (poză de studio realizată de \n"+
                    "Josif Schuller &amp; fiu).", 
                    "1913"],
            "en": ["Miți de Lemeny", 
                    "Brasov\'s first champion. It happened in skating, in the competition\n"+
                    "held in Vienna in 1913. In 1925, between 23 and 25 January, the national\n"+
                    "ice hockey championships and the national figure skating championships \n"+
                    "were held on the Brașovia ice rink. In the ladies\' competition,\n"+
                    "first prize was won by Mrs Maria Popp-Lemeny. In the photo, \n"+
                    "Maria (\"Miți\") Victoria de Lemény, 1910 \n"+
                    "(studio photo by Josif Schuller \& son).", 
                    "1913"]
        }, 15]);
    loadedImages.push([loadImage('memoryImg/main_images/3.png'), '3',
        {
            "ro": ["Ludovic Gall", 
                    "Ludovic Gall, atletul asociației sportive I.A.R. Brașov, a câștigat \n"+
                    "primul titlu de campion balcanic la maraton în anul 1933. A doua oară\n"+
                    "a devenit campion balcanic pe 26 mai 1935, la Atena, când a trecut \n"+
                    "primul linia de sosire după 3 ore 7 min. și 40 sec. A participat și la\n"+
                    "Jocurilor Olimpice de vară de la Berlin din 1936 (locul 23). În imagine,\n"+
                    "Ludovic Gall la o cursă de maraton ținută lângă București, în Bragadiru\n"+
                    "(„Universul”, 8 mai 1935).",
                    "1935"],
            "en": ["Ludovic Gall", 
                    "Ludovic Gall, athlete of the I.A.R. Brasov sports association, won the\n"+
                    "first Balkan marathon champion title in 1933. The second time he became\n"+
                    "Balkan champion on May 26, 1935, in Athens, when he crossed the finish\n"+
                    "line first after 3 hours 7 minutes and 40 seconds. He also took part in\n"+
                    "the 1936 Summer Olympics in Berlin (23rd place). In the picture, \n"+
                    "Ludovic Gall at a marathon race held near Bucharest, in Bragadiru \n"+
                    "(\"Universul\", 8 May 1935).",, 
                    "1935"]
        }, 10]);
    loadedImages.push([loadImage('memoryImg/main_images/4.png'), '4',
        {
            "ro": ["Ilona Micloș", 
                    "Deținătoarea recordului de titluri republicane în istoria sportului\n"+
                    "brașovean: 32 titluri, dintre care 26 la schi și 6 la atletism. În 1964,\n"+
                    "Ilona a câștigat medalia de bronz la combinată alpină, în cadrul \n"+
                    "Jocurilor Mondiale Universitare de Iarnă, ținute la Spindleruv Mlyn – \n"+
                    "Pardubice (Cehoslovacia). În fotografie, Ilona în antrenament pentru\n"+
                    "stabilirea poziției de coborâre. („Sport”, noiembrie 1965). \n",
                    "1965"],
            "en": ["Ilona Micloș", 
                    "Record holder of national titles in the history of Brașov sport: \n"+
                    "32 titles, of which 26 in skiing and 6 in athletics. In 1964, Ilona \n"+
                    "won the bronze medal in the Alpine skiing combined at the World \n"+
                    "University Winter Games held in Spindleruv Mlyn - \n"+
                    "Pardubice (Czechoslovakia). In the photo, Ilona in training for the\n"+
                    "downhill position (\"Sport\", November 1965).", 
                    "1965"]
        }, 8]);
    loadedImages.push([loadImage('memoryImg/main_images/5.png'), '5',
        {
            "ro": ["Prof. Dumitru Popescu-Colibași", 
                    "În 1956, echipa feminină de handbal Progresul Orașul Stalin, antrenată\n"+
                    "de D. Popescu-Colibași, a câștigat titlul de campioană republicană. \n"+
                    "În același an, jucătoarele sale Ana Stark, Mora Windt și Maria Scheip \n"+
                    "au devenit campioane mondiale la handbal în 11. La Tractorul Brașov a \n"+
                    "antrenat-o pe Iuliana Nako, campioană mondială la handbal în 7, \n"+
                    "în 1962. A antrenat şi loturile naţionale cucerind medalia de aur la\n"+
                    "CM de juniori – tineret în 1967. În fotografie, Dumitru \n"+
                    "Popescu-Colibași la un antrenament cu portărițele echipei Liceului \n"+
                    "nr. 2 din Brașov („Sport”, martie 1966).", 
                    "197O"],
            "en": ["Prof. Dumitru Popescu-Colibași", 
                    "In 1956, the women\'s handball team of Progresul Orașul Stalin, coached\n"+
                    "by D. Popescu-Colibași, won the republican championship title. In the \n"+
                    "same year, its players Ana Stark, Mora Windt and Maria Scheip became \n"+ 
                    "world champions in 11-a-side handball. At Tractorul Brașov he coached \n"+
                    "Iuliana Nako, world champion in 7-a-side handball in 1962. He also \n"+
                    "coached the national teams, winning the gold medal at the World Youth \n"+
                    "Championship in 1967. In the photo, Dumitru Popescu-Colibași at a \n"+
                    "training session with the goalkeepers of the team of Brașov High School\n"+
                    "no.2. („Sport”, March 1966).", 
                    "197O"]
        }, 6]);
    loadedImages.push([loadImage('memoryImg/main_images/6.png'), '6',
        {
            "ro": ["Silviu Ploeșteanu", 
                    "În noeimbrie 1956, echipa de fotbal Energia Metalul „Steagul Roșu” Orașul \n"+
                    "Stalin, antrenată de Silviu Ploeșteanu a jucat, în premieră, în campionatul \n"+
                    "Categoriei A. În 1960, Steagul Roșu Orașul Stalin a câștigat titlul de \n"+
                    "vicecampioană națională, la 7 puncte după C.C.A. București. Astfel, Steagul \n"+
                    "Roșu a reprezentat România în prima ediție a Cupei Balcanice, pe care a și\n"+
                    "câștigat-o în noiembrie 1961. Silviu Ploeșteanu (în mijloc) și echipa de \n"+
                    "fotbal Steagul Roșu Brașov în sezonul 1967 - 1968 („Sport”, februarie 1968).", 
                    "1961"],
            "en": ["Silviu Ploeșteanu", 
                    "In November 1956, the football team Energia Metalul \"Steagul Roșu\" Orașul \n"+
                    "Stalin, coached by Silviu Ploeșteanu, played, for the first time, in the \n"+
                    "Category A championship. In 1960, Steagul Roșu Orașul Stalin became \n"+
                    "national vice-champion, 7 points behind C.C.A. Bucharest. Thus, Steagul \n"+
                    "Roșu represented Romania in the first edition of the Balkan Cup, which it \n"+
                    "also won in November 1961. Silviu Ploeșteanu (middle) and the Steagul Roșu \n"+
                    "Brașov football team in the 1967 - 1968 season (\"Sport\", February 1968).", 
                    "1961"]
        }, 2]);
    loadedImages.push([loadImage('memoryImg/main_images/7.png'), '7',
        {
            "ro": ["Constantin Stere", 
                    "Component al echipei naționale de volei, câștigător al medaliei de bronz\n"+ 
                    "la Jocurile Olimpice de la Moscova din 1980.", 
                    "198O"],
            "en": ["Constantin Stere", 
                    "Member of the national volleyball team, bronze medal winner at the 1980\n"+
                    "Moscow Olympics.", 
                    "198O"]
        }, 5]);
    loadedImages.push([loadImage('memoryImg/main_images/8.png'), '8',
        {
            "ro": ["Mihai Covaliu", 
                    "În anul 2000, brașoveanul Mihai Covaliu a cucerit medalia de aur la sabie\n"+
                    "individual, la Jocurile Olimpice de vară de la Sidney, devenind primul \n"+
                    "campion olimpic la sabie din România. A devenit și campion mondial, \n"+
                    "în anul 2005, la Leipzig. În anul 2008, la Jocurile Olimpice de la \n"+
                    "Beijing a obținut medalia de bronz.", 
                    "2OOO"],
            "en": ["Mihai Covaliu", 
                    "In 2000, Mihai Covaliu, a Brașov native, won the gold medal in individual\n"+
                    "sabre at the Summer Olympics in Sydney, becoming the first Romanian \n"+
                    "Olympic sabre champion. He also became world champion in Leipzig in 2005. \n"+
                    "In 2008, he won the bronze medal at the Olympic Games in Beijing.", 
                    "2OOO"]
        }, 17]);

    restartTimelineButtonRo = loadImage('timelineImg/restart_ro.png');
    restartTimelineButtonEn = loadImage('timelineImg/restart_en.png'); //TODO:

    timelineBg = loadImage("timelineImg/timelineBg.png");
    memoryBg = loadImage("memoryImg/memoryBg.png");
    collageBg = loadImage("collageImg/collageBg.png");
    timelineNextButton_ro = loadImage("memoryImg/next_ro.png");
    timelineNextButton_en = loadImage("memoryImg/next_en.png");
    puzzleNextButton_ro = loadImage("puzzle12Img/next_ro.png");
    puzzleNextButton_en = loadImage("puzzle12Img/next_en.png");
    puzzleBg = loadImage("puzzle12Img/puzzleBg.png");

    collageImg1 = loadImage("collageImg/backgrounds/1.jpg");
    collageImg2 = loadImage("collageImg/backgrounds/2.jpg");
    collageImg3 = loadImage("collageImg/backgrounds/3.jpg");
    collageImg1Small = loadImage("collageImg/backgrounds/1_small.jpg");
    collageImg2Small = loadImage("collageImg/backgrounds/2_small.jpg");
    collageImg3Small = loadImage("collageImg/backgrounds/3_small.jpg");
    collageAreas = loadImage("collageImg/areas.png");

    puzzle12Images.push([loadImage('puzzle12Img/puzzles/1/image.jpg'),
        {
            "ro": ["Zi de patinaj.\n" +
                "Fotografie de Heinrich Lehmann",
                "„Actul de naștere” al Olimpiei a fost decizia adunării generale a Reuniunii \n" +
                "de patinaj din Brașov din 29 martie 1894. „Casa Reuniunii” a fost construită \n" +
                "lângă „noul” loc de patinaj. La sfârșitul anului 1895 clădirea era gata și \n" +
                "publicul a fost anunțat că deschiderea festivă va avea loc pe 19 ianuarie \n" +
                "1896, cu o „petrecere costumată” pe gheață.",
                "19O5",
                15],
            "en": ["Skating day.\n Photo by Heinrich Lehmann",
                "The \"birth certificate\"; of the Olimpia was the decision of the\n" +
                "general assembly of the Skating Meeting in Brașov on March 29, 1894. The\n" +
                "\"Meeting House\" was built next to the \"new\" skating\n" +
                "venue. By the end of 1895 the building was ready and the public was told\n" +
                "that the festive opening would take place on January 19, 1896, with a\n" +
                "\"costume party\" on ice.",
                "19O5",
                15],
        }
    ]);
    puzzle12Images.push([loadImage('puzzle12Img/puzzles/2/image.jpg'),
        {
            "ro": ["Echipa de hochei Steagul Roșu\n Brașov pe patinoarul de la Olimpia",
                "Între 15 și 20 ianuarie 1949, pe terenul de patinaj de sub Tâmpa, se\n" +
                "organizează „un mare turneu de hockey” pentru „Cupa Republicii Populare\n" +
                "Române”. Participă selecționatele orașelor București, Cluj, Miercurea Ciuc,\n" +
                "Sighișoara, Târgu Mureș și Brașov. În primul meci, selecționata București a\n" +
                "învins selecționata Brașov cu scorul de 11 – 1, cu trei puncte înscrise de\n" +
                "Flamaropol. Prima ediție a cupei „R.P.R.” la hockey a fost câștigată de\n" +
                "Echipa de hochei Steagul Roșu Brașov pe patinoarul de la Olimpia București,\n" +
                "cu 5 victorii din 5 meciuri. Patinoarul de sub Tâmpa a fost folosit și\n" +
                "pentru meciuri internaționale de hochei, aici jucând chiar și echipa\n" +
                "națională.",
                "196O", 12],
            "en": ["Steagul Roșu Brasov hockey team\n on the Olimpia ice rink",
                "Between 15 and 20 of January 1949, on the skating rink under Tâmpa, a\n" +
                "\"big hockey tournament\" for the \"Romanian People\'s\n" +
                "Republic Cup\" is organized. The teams of Bucharest, Cluj, Miercurea\n" +
                "Ciuc, Sighișoara, Târgu Mureș and Brașov participate. In the first game,\n" +
                "Bucharest defeated Brașov with a score of 11 to 1, three points being\n" +
                "scored Steagul Roșu Brasov hockey team on the Olimpia ice rink by\n" +
                "Flamaropol. The first edition of the \"R.P.R.\" hockey cup was won\n" +
                "by Bucharest, winning 5 of 5. The rink under Tâmpa also hosted\n" +
                "international hockey matches, even the national team playing here.\n",
                "196O", 12]
        }
    ]);
    puzzle12Images.push([loadImage('puzzle12Img/puzzles/3/image.jpg'),
        {
            "ro": ["Ilie Năstase și Ion Țiriac \niulie 1971",
                "Ion Țiriac s-a născut la câteva sute de metri de terenurile de tenis de la\n" +
                "Olimpia, pe strada Cerbului. În noiembrie 1957, pe terenul de sub Tâmpa s-a\n" +
                "desfășurat turneul de tenis de câmp al primilor opt jucători din lotul de\n" +
                "tineret al României. „Surpriza turneului a fost tânărul Țiriac de la\n" +
                "Energia Steagul Roșu” (din ziarul ,,Drum Nou”). În anul 1970, Ion Țiriac a\n" +
                "câștigat împreună cu Ilie Năstase turneul de la Roland Garros. Apoi,\n" +
                "avându-l partener tot pe Năstase, a jucat trei finale de Cupa Davis, toate\n" +
                "cu Statele Unite ale Americii (1969, 1970 și 1972).",
                "1971", 4],
            "en": ["Ilie Năstase and Ion Țiriac \nJuly 1971",
                "Ion Țiriac was born a few hundred metres from the tennis courts at Olimpia,\n" +
                "on Cerbului Street. In November 1957, the tennis tournament of the first\n" +
                "eight players of Romania\'s youth team was held on the court under\n" +
                "Tâmpa. \"The surprise of the tournament was young Țiriac from Energia\n" +
                "Steagul Roșu\" (from the newspaper \"Drum Nou\"). In 1970, Ion\n" +
                "Țiriac won the Roland Garros tournament together with Ilie Năstase. Then,\n" +
                "also with Nastase as his partner, he played three Davis Cup finals, all\n" +
                "against the United States of America (1969, 1970 and 1972).",
                "1971", 4]
        }
    ]);

    puzzle20Images.push([loadImage('puzzle20Img/puzzles/1/image.jpg'),
        {
            "ro": ["Zi de patinaj.\n" +
            "Fotografie de Heinrich Lehmann",
                "„Actul de naștere” al Olimpiei a fost decizia adunării generale a Reuniunii \n" +
                "de patinaj din Brașov din 29 martie 1894. „Casa Reuniunii” a fost construită \n" +
                "lângă „noul” loc de patinaj. La sfârșitul anului 1895 clădirea era gata și \n" +
                "publicul a fost anunțat că deschiderea festivă va avea loc pe 19 ianuarie \n" +
                "1896, cu o „petrecere costumată” pe gheață.",
                "19O5",
                15],
            "en": ["Skating day.\n Photo by Heinrich Lehmann",
                "The \"birth certificate\"; of the Olimpia was the decision of the\n" +
                "general assembly of the Skating Meeting in Brașov on March 29, 1894. The\n" +
                "\"Meeting House\" was built next to the \"new\" skating\n" +
                "venue. By the end of 1895 the building was ready and the public was told\n" +
                "that the festive opening would take place on January 19, 1896, with a\n" +
                "\"costume party\" on ice.",
                "19O5",
                15],
        }
    ]);
    puzzle20Images.push([loadImage('puzzle20Img/puzzles/2/image.jpg'),
        {
            "ro": ["Echipa de hochei Steagul Roșu\n Brașov pe patinoarul de la Olimpia",
                "Între 15 și 20 ianuarie 1949, pe terenul de patinaj de sub Tâmpa, se\n" +
                "organizează „un mare turneu de hockey” pentru „Cupa Republicii Populare\n" +
                "Române”. Participă selecționatele orașelor București, Cluj, Miercurea Ciuc,\n" +
                "Sighișoara, Târgu Mureș și Brașov. În primul meci, selecționata București a\n" +
                "învins selecționata Brașov cu scorul de 11 – 1, cu trei puncte înscrise de\n" +
                "Flamaropol. Prima ediție a cupei „R.P.R.” la hockey a fost câștigată de\n" +
                "Echipa de hochei Steagul Roșu Brașov pe patinoarul de la Olimpia București,\n" +
                "cu 5 victorii din 5 meciuri. Patinoarul de sub Tâmpa a fost folosit și\n" +
                "pentru meciuri internaționale de hochei, aici jucând chiar și echipa\n" +
                "națională.",
                "196O", 12],
            "en": ["Steagul Roșu Brasov hockey team\n on the Olimpia ice rink",
                "Between 15 and 20 of January 1949, on the skating rink under Tâmpa, a\n" +
                "\"big hockey tournament\" for the \"Romanian People\'s\n" +
                "Republic Cup\" is organized. The teams of Bucharest, Cluj, Miercurea\n" +
                "Ciuc, Sighișoara, Târgu Mureș and Brașov participate. In the first game,\n" +
                "Bucharest defeated Brașov with a score of 11 to 1, three points being\n" +
                "scored Steagul Roșu Brasov hockey team on the Olimpia ice rink by\n" +
                "Flamaropol. The first edition of the \"R.P.R.\" hockey cup was won\n" +
                "by Bucharest, winning 5 of 5. The rink under Tâmpa also hosted\n" +
                "international hockey matches, even the national team playing here.\n",
                "196O", 12]
        }
    ]);
    puzzle20Images.push([loadImage('puzzle20Img/puzzles/3/image.jpg'),
        {
            "ro": ["Ilie Năstase și Ion Țiriac \niulie 1971",
                "Ion Țiriac s-a născut la câteva sute de metri de terenurile de tenis de la\n" +
                "Olimpia, pe strada Cerbului. În noiembrie 1957, pe terenul de sub Tâmpa s-a\n" +
                "desfășurat turneul de tenis de câmp al primilor opt jucători din lotul de\n" +
                "tineret al României. „Surpriza turneului a fost tânărul Țiriac de la\n" +
                "Energia Steagul Roșu” (din ziarul ,,Drum Nou”). În anul 1970, Ion Țiriac a\n" +
                "câștigat împreună cu Ilie Năstase turneul de la Roland Garros. Apoi,\n" +
                "avându-l partener tot pe Năstase, a jucat trei finale de Cupa Davis, toate\n" +
                "cu Statele Unite ale Americii (1969, 1970 și 1972).",
                "1971", 4],
            "en": ["Ilie Năstase and Ion Țiriac \nJuly 1971",
                "Ion Țiriac was born a few hundred metres from the tennis courts at Olimpia,\n" +
                "on Cerbului Street. In November 1957, the tennis tournament of the first\n" +
                "eight players of Romania\'s youth team was held on the court under\n" +
                "Tâmpa. \"The surprise of the tournament was young Țiriac from Energia\n" +
                "Steagul Roșu\" (from the newspaper \"Drum Nou\"). In 1970, Ion\n" +
                "Țiriac won the Roland Garros tournament together with Ilie Năstase. Then,\n" +
                "also with Nastase as his partner, he played three Davis Cup finals, all\n" +
                "against the United States of America (1969, 1970 and 1972).",
                "1971", 4]
        }
    ]);

    puzzle30Images.push([loadImage('puzzle30Img/puzzles/1/image.png'),
        {
            "ro": ["Zi de patinaj.\n" +
            "Fotografie de Heinrich Lehmann",
                "„Actul de naștere” al Olimpiei a fost decizia adunării generale a Reuniunii \n" +
                "de patinaj din Brașov din 29 martie 1894. „Casa Reuniunii” a fost construită \n" +
                "lângă „noul” loc de patinaj. La sfârșitul anului 1895 clădirea era gata și \n" +
                "publicul a fost anunțat că deschiderea festivă va avea loc pe 19 ianuarie \n" +
                "1896, cu o „petrecere costumată” pe gheață.",
                "19O5",
                15],
            "en": ["Skating day.\n Photo by Heinrich Lehmann",
                "The \"birth certificate\"; of the Olimpia was the decision of the\n" +
                "general assembly of the Skating Meeting in Brașov on March 29, 1894. The\n" +
                "\"Meeting House\" was built next to the \"new\" skating\n" +
                "venue. By the end of 1895 the building was ready and the public was told\n" +
                "that the festive opening would take place on January 19, 1896, with a\n" +
                "\"costume party\" on ice.",
                "19O5",
                15],
        }
    ]);
    puzzle30Images.push([loadImage('puzzle30Img/puzzles/2/image.png'),
        {
            "ro": ["Echipa de hochei Steagul Roșu \nBrașov pe patinoarul de la Olimpia",
                "Între 15 și 20 ianuarie 1949, pe terenul de patinaj de sub Tâmpa, se\n" +
                "organizează „un mare turneu de hockey” pentru „Cupa Republicii Populare\n" +
                "Române”. Participă selecționatele orașelor București, Cluj, Miercurea Ciuc,\n" +
                "Sighișoara, Târgu Mureș și Brașov. În primul meci, selecționata București a\n" +
                "învins selecționata Brașov cu scorul de 11 – 1, cu trei puncte înscrise de\n" +
                "Flamaropol. Prima ediție a cupei „R.P.R.” la hockey a fost câștigată de\n" +
                "Echipa de hochei Steagul Roșu Brașov pe patinoarul de la Olimpia București,\n" +
                "cu 5 victorii din 5 meciuri. Patinoarul de sub Tâmpa a fost folosit și\n" +
                "pentru meciuri internaționale de hochei, aici jucând chiar și echipa\n" +
                "națională.",
                "196O", 12],
            "en": ["Steagul Roșu Brasov hockey team \non the Olimpia ice rink",
                "Between 15 and 20 of January 1949, on the skating rink under Tâmpa, a\n" +
                "\"big hockey tournament\" for the \"Romanian People\'s\n" +
                "Republic Cup\" is organized. The teams of Bucharest, Cluj, Miercurea\n" +
                "Ciuc, Sighișoara, Târgu Mureș and Brașov participate. In the first game,\n" +
                "Bucharest defeated Brașov with a score of 11 to 1, three points being\n" +
                "scored Steagul Roșu Brasov hockey team on the Olimpia ice rink by\n" +
                "Flamaropol. The first edition of the \"R.P.R.\" hockey cup was won\n" +
                "by Bucharest, winning 5 of 5. The rink under Tâmpa also hosted\n" +
                "international hockey matches, even the national team playing here.\n",
                "196O", 12]
        }
    ]);
    puzzle30Images.push([loadImage('puzzle30Img/puzzles/3/image.png'),
        {
            "ro": ["Ilie Năstase și Ion Țiriac \niulie 1971",
                "Ion Țiriac s-a născut la câteva sute de metri de terenurile de tenis de la\n" +
                "Olimpia, pe strada Cerbului. În noiembrie 1957, pe terenul de sub Tâmpa s-a\n" +
                "desfășurat turneul de tenis de câmp al primilor opt jucători din lotul de\n" +
                "tineret al României. „Surpriza turneului a fost tânărul Țiriac de la\n" +
                "Energia Steagul Roșu” (din ziarul ,,Drum Nou”). În anul 1970, Ion Țiriac a\n" +
                "câștigat împreună cu Ilie Năstase turneul de la Roland Garros. Apoi,\n" +
                "avându-l partener tot pe Năstase, a jucat trei finale de Cupa Davis, toate\n" +
                "cu Statele Unite ale Americii (1969, 1970 și 1972).",
                "1971", 4],
            "en": ["Ilie Năstase and Ion Țiriac \nJuly 1971",
                "Ion Țiriac was born a few hundred metres from the tennis courts at Olimpia,\n" +
                "on Cerbului Street. In November 1957, the tennis tournament of the first\n" +
                "eight players of Romania\'s youth team was held on the court under\n" +
                "Tâmpa. \"The surprise of the tournament was young Țiriac from Energia\n" +
                "Steagul Roșu\" (from the newspaper \"Drum Nou\"). In 1970, Ion\n" +
                "Țiriac won the Roland Garros tournament together with Ilie Năstase. Then,\n" +
                "also with Nastase as his partner, he played three Davis Cup finals, all\n" +
                "against the United States of America (1969, 1970 and 1972).",
                "1971", 4]
        }
    ]);

    puzzle12Thumbs.push(loadImage('puzzle12Img/puzzles/1/thumb.jpg'));
    puzzle12Thumbs.push(loadImage('puzzle12Img/puzzles/2/thumb.jpg'));
    puzzle12Thumbs.push(loadImage('puzzle12Img/puzzles/3/thumb.jpg'));

    puzzle20Thumbs.push(loadImage('puzzle20Img/puzzles/1/thumb.png'));
    puzzle20Thumbs.push(loadImage('puzzle20Img/puzzles/2/thumb.png'));
    puzzle20Thumbs.push(loadImage('puzzle20Img/puzzles/3/thumb.png'));

    puzzle30Thumbs.push(loadImage('puzzle30Img/puzzles/1/thumb.png'));
    puzzle30Thumbs.push(loadImage('puzzle30Img/puzzles/2/thumb.png'));
    puzzle30Thumbs.push(loadImage('puzzle30Img/puzzles/3/thumb.png'));

    puzLevel12_ro_active = loadImage('puzzle_general/img/dlvl-12-a-ro.png');
    puzLevel12_ro_inactive = loadImage('puzzle_general/img/dlvl-12-i-ro.png');
    puzLevel20_ro_active = loadImage('puzzle_general/img/dlvl-20-a-ro.png');
    puzLevel20_ro_inactive = loadImage('puzzle_general/img/dlvl-20-i-ro.png');
    puzLevel30_ro_active = loadImage('puzzle_general/img/dlvl-30-a-ro.png');
    puzLevel30_ro_inactive = loadImage('puzzle_general/img/dlvl-30-i-ro.png');

    puzLevel12_en_active = loadImage('puzzle_general/img/dlvl-12-a-en.png');
    puzLevel12_en_inactive = loadImage('puzzle_general/img/dlvl-12-i-en.png');
    puzLevel20_en_active = loadImage('puzzle_general/img/dlvl-20-a-en.png');
    puzLevel20_en_inactive = loadImage('puzzle_general/img/dlvl-20-i-en.png');
    puzLevel30_en_active = loadImage('puzzle_general/img/dlvl-30-a-en.png');
    puzLevel30_en_inactive = loadImage('puzzle_general/img/dlvl-30-i-en.png');

    puzButtonBg_ro = loadImage('puzzle_general/img/dlvl-bg-label-ro.png');
    puzButtonBg_en = loadImage('puzzle_general/img/dlvl-bg-label-en.png');

    activeGame = "puz20";
}

function setup() {
    textFont(fontNotoMedium);

    if (activeGame === "mem"){
        initializeMemory();
    }
    if (activeGame === "tl"){
        initializeTimeline();
    }
    if (activeGame === "puz12"){
        initializePuz12GameProps();
        initializePuzzle12();
    }
    if (activeGame === "puz20"){
        initializePuz20GameProps();
        initializePuzzle20();
    }
    if (activeGame === "puz30"){
        initializePuz30GameProps();
        initializePuzzle30();
    }
    if (activeGame === "col"){
        initializeCollage();
    }

    touchTargets.push(new TouchTarget());

    initializeMenuButtons();
}

function draw() {
    if (activeGame === "mem"){
        drawMemory();
    }
    if (activeGame === "tl"){
        drawTimeline();
    }
    if (activeGame === "puz12" || activeGame === "puz20" || activeGame === "puz30"){
        drawPuzzle();
    }
    if (activeGame === "col"){
        drawCollage();
    }

    drawMenuScreen();
    drawMenuButtons();

    // decrease idle timer
    idleTimer -= 1;
    if (idleTimer < 0) {
        let newGame = random(["mem", "tl", "puz12", "puz20", "puz30", "col"]);
        while(newGame === activeGame){
            newGame = random(["mem", "tl", "puz12", "puz30", "puz20", "col"]);
        }
        activeGame = newGame;
        resetCurrentGame();
        idleTimer = IDLE_TIMEOUT_NO_INTERACTION;
    }
    if (idleTimer < 1000) {
        drawTimeout();
    }

    // support for touch and desktop.
    setTouchTargets();
}

function setTouchTargets() {
    if (touches.length == 0) {
        touchTargets[0].x=mouseX;
        touchTargets[0].y=mouseY;
    } else {
        touchTargets[0].x=touches[0].x;
        touchTargets[0].y=touches[0].y;
    }
}

let gamesData;
let statsWritten = false;
function incrementGameOverStats() {
    if (!statsWritten) {
        let gameOverCounter = getItem(activeGame);
        if (gameOverCounter === null) {
            gameOverCounter = '';
        }
        gameOverCounter++;
        storeItem(activeGame, gameOverCounter);
    }
    statsWritten = true;
}

let timerValue = 100; // Initial timer value
let timerDuration = 100; // Total duration of the timer

function drawTimeout() {
    let angle = map(map(idleTimer, 0, 1000, 0, 100), 0, timerDuration, 0, TWO_PI);

    // Calculate the position for the center of the circle
    let centerX = 100;
    let centerY = 100;

    // Set up the stroke and fill
    noStroke();
    strokeWeight(4);
    noFill();

    // Draw the background circle
    ellipse(centerX, centerY, 100, 100);

    // Set up the fill for the timer arc
    fill(255, 255, 255);

    // Draw the timer arc
    arc(centerX, centerY, 100, 100, -HALF_PI, -HALF_PI + angle);

    fill(125);
    textSize(22);
    let timesPlayed = getItem(activeGame);
    if (timesPlayed === null) {
        timesPlayed = 0;
    }
    text(timesPlayed, 100, 100);

    // Display the timer value
}

// ++++++++++++++++++++++++++ MENU +++++++++++++++++++++++++++++

function initializeMenuButtons() {
    if (language === LANG_RO) {
        button1 = new Button(SCREEN_WIDTH - 100, (SCREEN_HEIGHT / 2) - 200, 128, 162, menuLanguage_ro);
    } else {
        button1 = new Button(SCREEN_WIDTH - 100, (SCREEN_HEIGHT / 2) - 200, 128, 162, menuLanguage_en);
    }
    button1.isVisible = true;
    if (language === LANG_RO) {
        button2 = new Button(SCREEN_WIDTH - 100, (SCREEN_HEIGHT / 2), 128, 162, menuGames_ro);
    } else {
        button2 = new Button(SCREEN_WIDTH - 100, (SCREEN_HEIGHT / 2), 128, 162, menuGames_en);
    }
    button2.isVisible = true;
    button3 = new Button(SCREEN_WIDTH - 100, (SCREEN_HEIGHT/2) + 200, 128, 162, menuInfo);
    button3.isVisible = true;

    buttonRo = new Button(SCREEN_WIDTH + 700, (SCREEN_HEIGHT/2) - 200, 394, 408, langRo);
    buttonEn = new Button(SCREEN_WIDTH + 270, (SCREEN_HEIGHT/2) - 200, 394, 408, langEn);

    if (language === LANG_RO) {
        buttonGameTimeline = new Button(SCREEN_WIDTH + 700, (SCREEN_HEIGHT / 2) - 200, 394, 550, imgGameTimeline);
        buttonGameMemory = new Button(SCREEN_WIDTH + 270, (SCREEN_HEIGHT / 2) - 200, 394, 550, imgGameMemory);
        buttonGamePuzzle = new Button(SCREEN_WIDTH + 700, (SCREEN_HEIGHT / 2) + 390, 394, 550, imgGamePuzzle);
        buttonGameColaj = new Button(SCREEN_WIDTH + 270, (SCREEN_HEIGHT / 2) + 390, 394, 550, imgGameColaj);
    } else if (language === LANG_EN) {
        buttonGameTimeline = new Button(SCREEN_WIDTH + 700, (SCREEN_HEIGHT / 2) - 200, 394, 550, imgGameTimeline_en);
        buttonGameMemory = new Button(SCREEN_WIDTH + 270, (SCREEN_HEIGHT / 2) - 200, 394, 550, imgGameMemory_en);
        buttonGamePuzzle = new Button(SCREEN_WIDTH + 700, (SCREEN_HEIGHT / 2) + 390, 394, 550, imgGamePuzzle_en);
        buttonGameColaj = new Button(SCREEN_WIDTH + 270, (SCREEN_HEIGHT / 2) + 390, 394, 550, imgGameColaj_en);
    }
}

function drawMenuButtons() {
    button1.draw();
    button2.draw();
    button3.draw();

    // language
    if (button1.isClicked(mouseX, mouseY)) {
        menu.isVisible = true;
        menu.currentOption = 0;
    }

    // games
    if (button2.isClicked(mouseX, mouseY)) {
        menu.isVisible = true;
        menu.currentOption = 1;
    }

    // info
    if (button3.isClicked(mouseX, mouseY)) {
        menu.isVisible = true;
        menu.currentOption = 2;
    }
}

function drawMenuScreen() {
    if (menu.isVisible) {
        displayMenuBox();
    } else {
        hideMenuBox()
    }
}

function hideMenuBox() {
    menu.currentPos = 0;
    menu.currentValue = 0;
    menu.incrementAmount = 0.001;
}

function displayMenuBox() {
    push();
    if (menu.currentPos < menu.fixedPosition) {
        // quad increments the position of the menu to the right.
        menu.currentPos = quadraticFunction() * menu.fixedPosition;
    }
    translate(menu.currentPos * -1, 0);
    fill(255);
    noStroke();
    rect(width, 0, width + menu.fixedPosition, height);

    // draw menu contents
    if (menu.currentOption === 0) { // Language
        drawLanguageMenu();
    }
    if (menu.currentOption === 1) { // Language
        drawGamesMenu();
    }
    if (menu.currentOption === 2) { // Language
        drawInfoMenu();
    }
    pop();

}

function drawGamesMenu() {
    buttonGameTimeline.isVisible = true;
    buttonGameMemory.isVisible = true;
    buttonGamePuzzle.isVisible = true;
    buttonGameColaj.isVisible = true;

    fill(0);
    textFont(fontNotoMedium);
    textStyle(NORMAL);
    textAlign(CENTER);
    textSize(45);
    if (language === LANG_RO) {
        text("Alege jocul preferat dintre\ncele patru variante de mai jos", SCREEN_WIDTH + 470, (SCREEN_HEIGHT/2) - 600);
    } else if (language === LANG_EN) {
        text("Choose your favorite game\nfrom the four options below", SCREEN_WIDTH + 470, (SCREEN_HEIGHT/2) - 600);
    }

    buttonGameTimeline.draw();
    buttonGameMemory.draw();
    buttonGamePuzzle.draw();
    buttonGameColaj.draw();

    if (buttonGameTimeline.isClicked(mouseX + menu.fixedPosition, mouseY)) {
        activeGame = "tl";

        // hide menu after language change
        if (menu.isVisible) {
            menu.isVisible = false;
        }

        resetCurrentGame();
    }

    if (buttonGameMemory.isClicked(mouseX + menu.fixedPosition, mouseY)) {
        activeGame = "mem";

        // hide menu after language change
        if (menu.isVisible) {
            menu.isVisible = false;
        }
        resetCurrentGame();
    }

    if (buttonGamePuzzle.isClicked(mouseX + menu.fixedPosition, mouseY)) {
        activeGame = "puz12";

        // hide menu after language change
        if (menu.isVisible) {
            menu.isVisible = false;
        }
        resetCurrentGame();
    }

    if (buttonGameColaj.isClicked(mouseX + menu.fixedPosition, mouseY)) {
        activeGame = "col";

        // hide menu after language change
        if (menu.isVisible) {
            menu.isVisible = false;
        }
        resetCurrentGame();
    }
}

function drawLanguageMenu() {
    buttonRo.isVisible = true;
    buttonEn.isVisible = true;
    buttonRo.draw();
    buttonEn.draw();

    if (buttonRo.isClicked(mouseX + menu.fixedPosition, mouseY)) {
        language = LANG_RO;


        // reset current game after language change

        // hide menu after language change
        if (menu.isVisible) {
            menu.isVisible = false;
        }
        resetCurrentGame();
    }
    if (buttonEn.isClicked(mouseX + menu.fixedPosition, mouseY)) {
        language = LANG_EN;

        //hide menu after language change
        if (menu.isVisible) {
            menu.isVisible = false;
        }
        resetCurrentGame();
    }
}

function drawInfoMenu() {
    if (language === LANG_RO) {
        image(infoRo, SCREEN_WIDTH, 0);
    } else if (language === LANG_EN) {
        image(infoEn, SCREEN_WIDTH, 0);
    }
}

function quadraticFunction() {
    menu.currentValue += menu.incrementAmount;
    menu.incrementAmount += 0.01;
    // Ensure the value does not exceed 1
    menu.currentValue = Math.min(menu.currentValue, 1);
    return menu.currentValue;
}

function resetCurrentGame() {
    if (activeGame === "mem") {
        mem.isInitialized = false;
        setup();
        mem.isInitialized = true;
    }
    if (activeGame === "tl") {
        tl.isInitialized = false;
        setup();
        tl.isInitialized = true;
    }
    if (activeGame === "puz12" || activeGame === "puz20" || activeGame === "puz30") {
        puz.isInitialized = false;
        setup();
        puz.isInitialized = true;
    }
    if (activeGame === "col") {
        col.isInitialized = false;
        setup();
        col.isInitialized = true;
    }

    idleTimer = IDLE_TIMEOUT_INTERACTION;
    statsWritten = false;
    print("times played: " + getItem(activeGame));
}



// ++++++++++++++++++++++++++ TIMELINE +++++++++++++++++++++++++++++
function initializeTimeline() {
    createCanvas(SCREEN_WIDTH, SCREEN_HEIGHT);

    tl = {
        propertiesIdentifier: "tl",
        isInitialized: false,
        // this controls the limits of within which cards can move on posX
        EASE_IN_FACTOR_DISPERSE_LEFT_LIMIT: -800,
        EASE_IN_FACTOR_DISPERSE_RIGHT_LIMIT: 800,

        // this controls the limits within which cards can move on posY
        POSY_OFFSET_DISPERSE_LEFT_LIMIT: -60,
        POSY_OFFSET_DISPERSE_RIGHT_LIMIT: 30,

        // position for the initial card starting the game
        POSY_INITIAL_CARD: undefined,
        POSX_INITIAL_CARD: undefined,

        // position for the deck, how far to enter the canvas.
        POSY_INITIAL_DECK: undefined,

        // card sizes
        CARD_WIDTH: 288,
        CARD_HEIGHT: 488,
        PLACEHOLDER_WIDTH: 260,
        PLACEHOLDER_HEIGHT: 520,

        // ++++ UTILS +++++
        restartButton: restartTimelineButtonRo,
        // timeout for final start display
        timeoutStar1: 0,
        timeoutStar2: 25,
        timeoutStar3: 50,
        timeoutStarText: 75,

        //  ----- ERRORS -----
        errors: 0,
        persistentErrors: -1,
        historyErrors: -1,

        ERRORS_3_STARS: 3,
        ERRORS_2_STARS: 5,
        ERRORS_1_STARS: 10,
        // -------------------------------

        //  ----- CARDS && PLACEHOLDERS -----
        selectedCard: undefined,
        cards: [],
        placeholders: [],

        undiscoveredCardIds: new Set(),
        discoveredPlaceholders: new Set(),
        // -------------------------------

        // ----- STARS VARIABLES -----
        STAR_ROTATION_SPEED: 0.0,
        STAR_RADIUS: 80,

        startRotationParam: -0.3,
        // -------------------------------

        // ----- POP-UP variables -----
        cardPopUpProperties: {
            dynamicRadius: 0,
            targetRadius: 30,
            currentSize: 0,
            elasticity: 0.07,
            velocity: 2,
            position: 0,
            inc: 10,
            displayPopUp: false,
            showPropertiesInitialized: false,
            hidePropertiesInitialized: false,
            popupWidth: 900,
            popupHeight: 1600,
        },
        infoPopUpProperties: {
            dynamicRadius: 10,
            targetRadius: 30,
            currentSize: 20,
            elasticity: 0.07,
            velocity: 2,
            position: 0,
            inc: 3,
            displayPopUp: false,
            showPropertiesInitialized: false,
            hidePropertiesInitialized: false,
        },
        // -------------------------------

        // ----- MATCH/WIN animation variables -----
        cardMatchProperties: {
            WIN_PARTICLE_ANIMATION_DURATION: 2, // duration for generating particles.
            particles: [], // list of particles for card match animation.
            shouldDisplay: false,
            placeholder: -1, // placeholder to use in positioning card match animation.
            particleAnimationDuration: this.WIN_PARTICLE_ANIMATION_DURATION,
            numberOfParticles: 55, // number of particles.
        },
        winProperties: {
            particles: [], // list of particles for win animation.
            finalWin: false, // reached the final stage where all cards match.
            posx: undefined,
            posy: undefined,
            timeoutTillStart: 30, // delay before starting the final win animation.
            placeholderModifier: {
                red: 0, // color of the placeholder when scrolling through matching cards at the end.
                green: 206,
                blue: 209,
                stroke: 0, // remove stroke at the end when changing placeholder colors.
                scale: 2, // scale placeholder while scrolling through matching cards at the end.
            },
            winStarHorizontalSpeed: 15,
        }

    }

    if (language === LANG_EN) {
        tl.restartButton = restartTimelineButtonEn;
    }

    tl.POSX_INITIAL_CARD = width/2;
    tl.POSY_INITIAL_CARD = 1100;
    tl.POSY_INITIAL_DECK = 1500;

    // select 7 random image ids. they are ordered chronologically so should be arranged ascending.
    let numbersArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21];
    let selectedNumbers = selectUniqueNumbers(numbersArray, 7).sort((a, b) => a - b);

    let yearsMap = {
        1: "1894",
        2: "1896",
        3: "19O3",
        4: "19O5",
        5: "192O",
        6: "1924",
        7: "1928",
        8: "193O",
        9: "1934",
        10: "1949",
        11: "1951",
        12: "1956",
        13: "1959",
        14: "196O",
        15: "1961",
        16: "1963",
        17: "1965",
        18: "1968",
        19: "1974",
        20: "1986",
        21: "1988",
    };

    tl.cards.push(new Card(selectedNumbers[0],(width/2) + 20, height+50, random(-1, - 0.9), random(-1, -0.6)));
    tl.cards.push(new Card(selectedNumbers[1], (width/2) + 10, height+40, random(1, 0.8), random(0.6, 1)));
    tl.cards.push(new Card(selectedNumbers[2], width/2, height+30, random(-0.5, -0.3), random(0.5, 0.9)));
    tl.cards.push(new Card(selectedNumbers[3], (width/2) - 10, height+20,)); // middle card
    tl.cards.push(new Card(selectedNumbers[4], (width/2) - 20, height+10, random(-0.2, 0.7), random(1, 0.6)));
    tl.cards.push(new Card(selectedNumbers[5], (width/2) - 30, height, random(1, 0.5), random(-1, -0.6)));
    tl.cards.push(new Card(selectedNumbers[6], (width/2) - 40, height-10, random(0.0, 0.0), random(-1, 0)));

    tl.placeholders.push(new Placeholder(1,
        tl.POSX_INITIAL_CARD - tl.PLACEHOLDER_WIDTH * 3 - 90,
        tl.POSY_INITIAL_CARD,
        tl.PLACEHOLDER_WIDTH,
        tl.PLACEHOLDER_HEIGHT,
        selectedNumbers[0], yearsMap[selectedNumbers[0]], "info card 7", tl));
    tl.placeholders.push(new Placeholder(2,
        tl.POSX_INITIAL_CARD - tl.PLACEHOLDER_WIDTH * 2 - 60,
        tl.POSY_INITIAL_CARD,
        tl.PLACEHOLDER_WIDTH,
        tl.PLACEHOLDER_HEIGHT,
        selectedNumbers[1], yearsMap[selectedNumbers[1]], "info card 1", tl));
    tl.placeholders.push(new Placeholder(3,
        tl.POSX_INITIAL_CARD - tl.PLACEHOLDER_WIDTH - 30,
        tl.POSY_INITIAL_CARD,
        tl.PLACEHOLDER_WIDTH,
        tl.PLACEHOLDER_HEIGHT,
        selectedNumbers[2], yearsMap[selectedNumbers[2]], "info card 2", tl));
    tl.placeholders.push(new Placeholder(4,
        tl.POSX_INITIAL_CARD,
        tl.POSY_INITIAL_CARD,
        tl.PLACEHOLDER_WIDTH,
        tl.PLACEHOLDER_HEIGHT,
        selectedNumbers[3], yearsMap[selectedNumbers[3]], "info card 3", tl));
    tl.placeholders.push(new Placeholder(5,
        tl.POSX_INITIAL_CARD + tl.PLACEHOLDER_WIDTH + 30,
        tl.POSY_INITIAL_CARD,
        tl.PLACEHOLDER_WIDTH,
        tl.PLACEHOLDER_HEIGHT,
        selectedNumbers[4], yearsMap[selectedNumbers[4]], "info card 4", tl));
    tl.placeholders.push(new Placeholder(6,
        tl.POSX_INITIAL_CARD + tl.PLACEHOLDER_WIDTH * 2 + 60,
        tl.POSY_INITIAL_CARD,
        tl.PLACEHOLDER_WIDTH,
        tl.PLACEHOLDER_HEIGHT,
        selectedNumbers[5], yearsMap[selectedNumbers[5]], "info card 5", tl));
    tl.placeholders.push(new Placeholder(7,
        tl.POSX_INITIAL_CARD + tl.PLACEHOLDER_WIDTH * 3 + 90,
        tl.POSY_INITIAL_CARD,
        tl.PLACEHOLDER_WIDTH,
        tl.PLACEHOLDER_HEIGHT,
        selectedNumbers[6], yearsMap[selectedNumbers[6]], "info card 6", tl));

    //initialize winProperties animation to start at the position of the first placeholder.
    tl.winProperties.posx = tl.placeholders[0].posx;
    tl.winProperties.posy = tl.placeholders[0].posy;

    // initialize the set of undiscovered cards. this is used in displaying pop-ups.
    for (let i = 0; i < tl.cards.length; i++) {
        tl.undiscoveredCardIds.add(tl.cards[i].id);
    }
}

function drawTimeline() {
    background(timelineBg);

    // guiding lines center of the screen.
    // line(0, 840, width, 840);
    // line(0, height-840, width, height-840);

    // stroke(1);

    // display final win animation behind all cards.
    // check if all cards have been disclosed
    tl.winProperties.finalWin = tl.undiscoveredCardIds.size === 0
        && tl.winProperties.posx < tl.placeholders[tl.placeholders.length-1].posx + 10
        && tl.cardMatchProperties.particles.length === 0;
    // in final animation, display win animation for all placeholders and gradually remove them from the discovered set.
    if (tl.winProperties.finalWin) {
        tl.winProperties.timeoutTillStart--;
        if (tl.winProperties.timeoutTillStart < 0) {

            // change rect colors progressively as the particles move
            for (let j=0; j < tl.placeholders.length; j++) {
                if (tl.winProperties.posx >= tl.placeholders[j].posx - tl.winProperties.winStarHorizontalSpeed
                    && tl.winProperties.posx <= tl.placeholders[j].posx + tl.winProperties.winStarHorizontalSpeed) {
                    tl.placeholders[j].rectColorR = tl.winProperties.placeholderModifier.red;
                    tl.placeholders[j].rectColorG = tl.winProperties.placeholderModifier.green;
                    tl.placeholders[j].rectColorB = tl.winProperties.placeholderModifier.blue;
                    tl.placeholders[j].phStroke = tl.winProperties.placeholderModifier.stroke;
                    tl.placeholders[j].activeCard.scaleFactor = tl.winProperties.placeholderModifier.scale;
                    break;
                }
            }

            tl.winProperties.posx += tl.winProperties.winStarHorizontalSpeed;
        }
        initShowInfoPopUp(tl);
    }
    if (tl.undiscoveredCardIds.size === 0 && tl.winProperties.timeoutTillStart < 0) {
        createFinalWinParticlesAnimation(tl.winProperties.posx, tl.placeholders[tl.placeholders.length - 1].posx + 10, tl);
        // write stats
        incrementGameOverStats();
    }
    // -------- END final win animation


    // ------- initial card placeholders and card placement check
    checkPlaceholderCards();
    drawDiscoveredYears();
    // ----------------------------------


    let winCard = undefined;
    // initialize and display the cards.
    for (let i = 0; i < tl.cards.length; i++) {
        let currentCard = tl.cards[i];

        if (!currentCard.initialized){
            currentCard.initialize();
        } else if (!currentCard.dispersed) {
            currentCard.disperse();
        } else if (currentCard.shouldBeReturned) {
            currentCard.returnToScatteredPosition();
        } else {
            // display card
            if (tl.cardMatchProperties.placeholder !== undefined
                && tl.cardMatchProperties.placeholder.activeCard !== undefined
                && tl.cardMatchProperties.placeholder.activeCard.id === currentCard.id) {
                winCard = currentCard; // draw this card later, after particles win animation.
            } else {
                currentCard.draw();
            }
        }
    }

    // if any win condition, draw win animation particles.

    //  ^^^^^^ WIN ANIMATIONS ^^^^^^^^^^^
    if (winCard !== undefined) {
        // avoid win animation on the first card that is already positioned on the right spot.
        if (!winCard.isFirstCard()){
            generateMatchParticles(tl);
        }
        winCard.draw();
    }
    // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^


    // display pop-ups +++++++++++++++++++++++++++++++++++
    drawPopUp(tl);
    // +++++++++++++++++++++++++++++++++++++++


    // ++++++++ display info dialog +++++++
    if (isGameOver()) { // check if final win animation is over.
        // drawInfoPopUp(width/2, height/2, tl);
        drawWinStars(tl);
    }

    // ++++++++++++++++++++++++++++++++++++

    // DEBUG - display FPS
    // if (random() > 0.9) {
    //     fps = (fps + frameRate())/2; // Get the current frames per second
    // }
    // textSize(16);
    // fill(0);
    // text("FPS: " + fps.toFixed(0), 20, 20);
    // text("ERRORS: " + tl.historyErrors, 20, 40);

    textFont(fontNotoMedium);
    textStyle(NORMAL);
    textAlign(CENTER);
    textSize(90);
    fill(0);
    if (language === LANG_RO) {
        text('ISTORIA SPORTULUI', width / 2, 300);
    } else if (language === LANG_EN) {
        text('SPORT’S HISTORY', width / 2, 300);
    }

    textSize(45);
    textStyle(BOLD);
    if (language === LANG_RO) {
        text('Aranjează cărțile în ordine cronologică', width / 2, 400);
    } else if (language === LANG_EN) {
        text('Arrange the cards in chronological order', width / 2, 400);
    }

    textFont(fontNotoLight);
    textStyle(NORMAL);
    if (language === LANG_RO) {
        text('și descoperă istoria sportului brașovean', width/2, 450);
    } else if (language === LANG_EN) {
        text('and discover the sports history of Brașov', width/2, 450);
    }
}

function selectUniqueNumbers(arr, numToSelect) {
    if (arr.length < numToSelect) {
        console.log("Error: Not enough elements in the array to select from.");
        return [];
    }

    let selectedNumbers = [];
    let copiedArray = arr.slice(); // Create a copy of the original array to avoid modifying it

    for (let i = 0; i < numToSelect; i++) {
        const randomIndex = Math.floor(Math.random() * copiedArray.length);
        selectedNumbers.push(copiedArray[randomIndex]);
        copiedArray.splice(randomIndex, 1);
    }

    return selectedNumbers;
}

function isGameOver() {
    return tl.winProperties.posx > 1900;
        // && !tl.winProperties.finalWin
        // && tl.undiscoveredCardIds.size === 0 && tl.cardMatchProperties.particles.length === 0 && tl.winProperties.timeoutTillStart < 0;;
}

function checkPlaceholderCards() {
    // reset cards active placeholders and set them later together with the placeholder settings.
    for (let i = 0; i < tl.cards.length; i++) {
        tl.cards[i].activePlaceholder = undefined;
    }

    tl.errors = 0;
    for (let i = 0; i < tl.placeholders.length; i++) {
        let currentPlaceholder = tl.placeholders[i];
        currentPlaceholder.activeCard = undefined;
        currentPlaceholder.draw();

        // check if card should be snapped into placeholder.
        for (let i = 0; i < tl.cards.length; i++) {
            let currentCard = tl.cards[i];
            if (currentPlaceholder.isCardOver(currentCard) && currentPlaceholder.activeCard === undefined) {
                // set active card and placeholder to each other.
                currentPlaceholder.activeCard = currentCard;
                currentCard.activePlaceholder = currentPlaceholder;

                // if a card has been discovered AND is correct, display pop-up and remove it from the undiscovered set.
                // this prevents repeated displays of pop-ups over already discovered cards.
                if (!isAnySelectedCard() && currentPlaceholder.activeCard.id === currentPlaceholder.correctCardId
                    && tl.undiscoveredCardIds.has(currentCard.id)) {
                    tl.undiscoveredCardIds.delete(currentCard.id);
                    tl.discoveredPlaceholders.add(currentPlaceholder);

                    initShowPopUp(tl,currentPlaceholder);
                    initDisplayMatchAnimation(currentPlaceholder, tl); // display win animation particles.
                }
            }
        }

        // counter errors.
        if (!isAnySelectedCard()
            && currentPlaceholder.activeCard !== undefined
            && currentPlaceholder.activeCard.id !== currentPlaceholder.correctCardId) {

            tl.errors++;
            currentPlaceholder.activeCard.shouldBeReturned = true;
            currentPlaceholder.showWrongAnimation = true;
            currentPlaceholder.activeCard.activePlaceholder = undefined;
            currentPlaceholder.activeCard = undefined;
        }
    }

    // this keeps track of real errors during the whole game.
    countPersistentErrors();

}

function drawDiscoveredYears() {
    for (let item of tl.discoveredPlaceholders) {
        fill(0);
        stroke(1);
        strokeWeight(1);
        textSize(60);
        textFont(fontZebrra);
        text(item.year, item.posx, item.posy + item.height/2 + 40);
    }
}

function countPersistentErrors() {
    if (tl.errors !== tl.persistentErrors && !isAnySelectedCard()) {
        if (tl.errors > tl.persistentErrors) {
            tl.historyErrors++;
        }
        tl.persistentErrors = tl.errors;
    }
}

function isAnySelectedCard() {
    if (activeGame === tl.propertiesIdentifier) {
        return tl.selectedCard !== undefined;
    }
    if (activeGame === puz.propertiesIdentifier) {
        return puz.selectedCard !== undefined;
    }
    if (activeGame === col.propertiesIdentifier) {
        return col.selectedCard !== undefined;
    }
    return false;
}

function clearSelectedCard() {
    if (activeGame === tl.propertiesIdentifier) {
        tl.selectedCard = undefined;
    }
    if (activeGame === puz.propertiesIdentifier) {
        puz.selectedCard = undefined;
    }
    if (activeGame === col.propertiesIdentifier) {
        col.selectedCard = undefined;
    }
}



// +++++++++++++++++++++++ MEMORY GAME +++++++++++++++++++++++++

function initializeMemory() {
    createCanvas(SCREEN_WIDTH, SCREEN_HEIGHT);

    mem = {
        fps: 0,
        propertiesIdentifier: "mem",
        isInitialized: false,
        maskImg: undefined,
        icons: [],
        images: [],
        burnedImages: new Set(), // images that have already been selected by randomness and should not be selected anymore in current game.

        nextButton: undefined,

        gameState: {
            isLevelOver: false,
            isWon: false,
            isLost: false,
            isGameOver: false,
            levelNumber: 1,
            MAX_LEVELS: 3,
            originalNumberOfIcons: undefined, // used in error calculation.
            allIconsDispersed: false,
        },


        // ----- STARS VARIABLES -----
        STAR_ROTATION_SPEED: 0.0,
        STAR_RADIUS: 80,
        startRotationParam: -0.3,
        // -------------------------------


        infoPopUpProperties: {
            dynamicRadius: 10,
            targetRadius: 30,
            currentSize: 20,
            elasticity: 0.07,
            velocity: 2,
            position: 0,
            inc: 3,
            displayPopUp: false,
            showPropertiesInitialized: false,
            hidePropertiesInitialized: false,
        },

        cardPopUpProperties: {
            dynamicRadius: 0,
            targetRadius: 30,
            currentSize: 0,
            elasticity: 0.07,
            velocity: 2,
            position: 0,
            inc: 3,
            displayPopUp: false,
            showPropertiesInitialized: false,
            hidePropertiesInitialized: false,
            popupWidth: 900,
            popupHeight: 530,
            popupPosx: 1080,
            popupPosy: 3000,
            currentTitle: "title",
            // 72 chars per line for description.
            currentDescription: "description description description description description description " +
                "\nnew line new line2" +
                "\nnew line new line3" +
                "\nnew line new line4" +
                "\nnew line new line5" +
                "\nnew line new line6",
            currentYear: "9999",
            currentImageObject: undefined,
        },

        // levels of error
        ERRORS_LEVEL_1: 2, // reveal first layer
        ERRORS_LEVEL_2: 3, // reveal whole image
        ERRORS_LEVEL_3: 4, // game over

        ERRORS_3_STARS: 3,
        ERRORS_2_STARS: 7,
        ERRORS_1_STARS: 22,

        EASE_IN_FACTOR_DISPERSE_LEFT_LIMIT: -500,
        EASE_IN_FACTOR_DISPERSE_RIGHT_LIMIT: 500,

        // this controls the limits within which cards can move on posY
        POSY_OFFSET_DISPERSE_LEFT_LIMIT: -60,
        POSY_OFFSET_DISPERSE_RIGHT_LIMIT: 60,

        // ------- ERRORS ---------
        persistentErrors: 0,
        historyErrors: 0,
        // ------------------------

        cardMatchProperties: {
            WIN_PARTICLE_ANIMATION_DURATION: 2, // duration for generating particles.
            particles: [], // list of particles for card match animation.
            shouldDisplay: false,
            particleAnimationDuration: this.WIN_PARTICLE_ANIMATION_DURATION,
            numberOfParticles: 15, // number of particles.
            placeholder: undefined,
        },

        // ++++ UTILS ++++++
        // timeout for final start display
        timeoutStar1: 25,
        timeoutStar2: 50,
        timeoutStar3: 75,
        timeoutStarText: 100,
        restartButton: restartTimelineButtonRo,

    }

    // Memory game
    for (let i=0; i<loadedImages.length; i++){
        mem.images.push(loadedImages[i]);
    }

    initializeNewImage();
    initializeIcons();
}

function drawMemory() {
    background(memoryBg);

    // guiding lines center of the screen.
    // line(0, 840, width, 840);
    // line(0, height - 840, width, height - 840);

    if (!mem.gameState.isGameOver) {
        mem.maskImg.draw();

        generateMatchParticles(mem);

        // icons display and click logic.
        drawIcons();

    }

    removeInvisibleIcons();
    processErrors();

    // next button logic
    if (mem.gameState.allIconsDispersed && !mem.gameState.isGameOver) {
        mem.nextButton.isVisible = true; // show next button only when all icons are dispersed.
        // display current level text
        textFont(fontNotoMedium);
        textStyle(NORMAL);
        textAlign(CENTER);
        textSize(45);
        fill(0);
        text(mem.gameState.levelNumber + "/3", width/2, height/2 - 1000);
    }

    if (mem.nextButton.isVisible && mem.nextButton.isClicked(mouseX, mouseY)) {
        // penalize if image is skipped
        if (!mem.gameState.isLevelOver) {
            mem.persistentErrors += mem.icons.length;
        }
        resetNewGame();
        mem.nextButton.isVisible = false;
    }

    if (mem.gameState.isLevelOver) {
        initializeImagePoupInfo();
        initShowPopUp(mem);
        removeRemainingWrongIcons();

        mem.maskImg.zoomLevel = mem.ERRORS_LEVEL_3; // display whole image.

        if (mem.gameState.isGameOver) {
            mem.nextButton.isVisible = false;
            mem.infoPopUpProperties.displayPopUp = true;
        }

    }
    mem.nextButton.draw();

    // DEBUG - display FPS
    // if (random() > 0.9) {
    //     mem.fps = (mem.fps + frameRate()) / 2; // Get the current frames per second
    // }
    // textSize(16);
    // fill(0);
    // text("FPS: " + mem.fps.toFixed(0), 20, 20);
    // text("ERRORS: " + mem.persistentErrors, 20, 40);

    drawMemoryHeaderText();

    if (mem.gameState.isGameOver) {
        // initShowInfoPopUp(mem);
        drawWinStars(mem);
        incrementGameOverStats();
    }

    drawInfoPopUp(width / 2, height / 2, mem);

    drawPopUp(mem);
}

function removeRemainingWrongIcons() {
    for (let i = 0; i < mem.icons.length; i++) {
        if (mem.icons[i].id !== mem.maskImg.associatedId && !mem.icons[i].wrongIconSelected) {
            mem.icons[i].wrongIconSelection();
        }
    }
}

// calculate number of errors, display additional image levels as errors increase, display next
function processErrors() {
    if (!mem.gameState.isLevelOver && !mem.gameState.isGameOver) {
        mem.historyErrors = mem.gameState.originalNumberOfIcons - mem.icons.length;
        mem.maskImg.zoomLevel = mem.historyErrors;

        // if minimum numbers of icons are left -> game over and remove all other icons.
        // this also checks if last wrong icon finished animation.
        if (mem.historyErrors >= mem.ERRORS_LEVEL_3 && mem.icons.length <= mem.gameState.originalNumberOfIcons - mem.ERRORS_LEVEL_3) {
            removeRemainingWrongIcons();
        }

        // process when game is over for current image
        if (mem.icons.length === 1) {
            mem.gameState.isLevelOver = true;
            mem.gameState.isLost = true;
        }

        if (mem.gameState.levelNumber > mem.gameState.MAX_LEVELS) {
            mem.gameState.isGameOver = true;
        }
    }
}

// removes icons that have been zoomed out.
function removeInvisibleIcons() {
    for (let i = 0; i < mem.icons.length; i++) {
        if (mem.icons[i].scaleFactor < 0) {
            mem.icons.splice(i, 1);
            break;
        }
    }
}

function resetNewGame() {
    initializeNewImage();
    mem.persistentErrors += mem.historyErrors; // preserve history errors from previous level.
    mem.icons = [];

    initializeIcons();
    initHidePopUp(mem);

    mem.gameState.isLevelOver = false;
    mem.gameState.isWon = false;
    mem.gameState.isLost = false;
    mem.gameState.isLevelOver = false;

    mem.gameState.levelNumber++;
}

function drawMemoryHeaderText() {
    textFont(fontNotoMedium);
    textStyle(NORMAL);
    textAlign(CENTER);
    textSize(90);
    fill(0);
    if (language === LANG_RO) {
        text('SIMBOLURILE SPORTULUI', width / 2, 300);
    } else if (language === LANG_EN) {
        text('SPORTS ICONS', width / 2, 300);
    }

    textSize(45);
    textStyle(BOLD);
    if (language === LANG_RO) {
        text('La ce disciplină a devenit un simbol personajul din imagine?', width / 2, 400);
    } else if (language === LANG_EN) {
        text('Which sport gave the person in the image an icon status?', width / 2, 400);
    }

    textFont(fontNotoLight);
    textStyle(NORMAL);
    if (language === LANG_RO) {
        text('Alege pictograma potrivită și descoperă legende ale sportului brașovean.', width / 2, 450);
    } else if (language === LANG_EN) {
        text('Pick the right pictogram and discover Brașov sports legends.', width / 2, 450);
    }
}

function drawIcons() {
    mem.gameState.allIconsDispersed = true;
    for (let i = 0; i < mem.icons.length; i++) {
        let currentIcon = mem.icons[i];
        currentIcon.disperse();
        currentIcon.draw();

        if (currentIcon.isActive(mouseX, mouseY)) {
            if (mem.maskImg.associatedId === currentIcon.id) { // correct icon selected.
                if (!currentIcon.correctIconSelected) {
                    currentIcon.correctIconSelection();
                    if (!mem.gameState.isLevelOver) {
                        initDisplayMatchAnimation(currentIcon, mem);
                        // initShowPopUp(mem);
                    }

                    mem.gameState.isWon = true;
                    mem.gameState.isLevelOver = true;
                }
            } else { // wrong icon selected.
                currentIcon.wrongIconSelection();
                // break;
            }
        }

        mem.gameState.allIconsDispersed = mem.gameState.allIconsDispersed && currentIcon.dispersed;
    }
}

function initializeImagePoupInfo(){
    mem.cardPopUpProperties.currentTitle = mem.cardPopUpProperties.currentImageObject[2][language][0]; // index 2 is the title of the image.
    mem.cardPopUpProperties.currentDescription = mem.cardPopUpProperties.currentImageObject[2][language][1]; // index 3 is the description of the image.
    mem.cardPopUpProperties.currentYear = mem.cardPopUpProperties.currentImageObject[2][language][2]; // index 4 is the year of the image.
}

function initializeNewImage() {
    let randomImg = random(mem.images);
    while (mem.burnedImages.has(randomImg[1])) { // keep selecting till new image is selected.
        randomImg = random(mem.images);
    }
    let img = randomImg[0]; // index 0 is the loaded image, index 1 is the unique id of the image.
    mem.burnedImages.add(randomImg[1]); // add image unique ID.
    mem.cardPopUpProperties.currentImageObject = randomImg;

    let cropSize1 = 300;
    let crop1 = new CropSettings(cropSize1, cropSize1, img.width / 2 - cropSize1 / 2, img.height / 2 - cropSize1 / 2);
    let cropSize2 = 600;
    let crop2 = new CropSettings(cropSize2, cropSize2, img.width / 2 - cropSize2 / 2, img.height / 2 - cropSize2 / 2);
    let cropSize3 = 1800; // whole image reveal
    let crop3 = new CropSettings(cropSize3, cropSize3, img.width / 2 - cropSize3 / 2, img.height / 2 - cropSize3 / 2);

    let correctSportId = randomImg[3];
    mem.maskImg = new MaskImage(img, correctSportId, crop1, crop2, crop3, mem);

    if (language === LANG_RO) {
        mem.nextButton = new Button(width / 2, height / 2 - 900, 600, 128, timelineNextButton_ro);
    } else if(language === LANG_EN) {
        mem.nextButton = new Button(width / 2, height / 2 - 900, 600, 128, timelineNextButton_en);
    }
}

function initializeIcons() {
    mem.icons = [];
    mem.icons.push(new Icon(9, (width / 2), height / 2, 1, -0.4, mem));
    mem.icons.push(new Icon(15, (width / 2), height / 2, -1, -0.4, mem));
    mem.icons.push(new Icon(10, width / 2, height / 2, 0.4, -1, mem));
    mem.icons.push(new Icon(8, (width / 2), height / 2, 0.4, 1, mem));
    mem.icons.push(new Icon(6, (width / 2), height / 2, -0.4, -1, mem));
    mem.icons.push(new Icon(2, (width / 2), height / 2, -0.4, 1, mem));
    mem.icons.push(new Icon(5, (width / 2), height / 2, 1, 0.4, mem));
    mem.icons.push(new Icon(17, (width / 2), height / 2, -1, 0.4, mem));

    mem.gameState.originalNumberOfIcons = mem.icons.length;
}


// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++




// +++++++++++++++++++++++ COLLAGE +++++++++++++++++++++++++

function initializeCollage() {
    createCanvas(SCREEN_WIDTH, SCREEN_HEIGHT);

    col = {
        propertiesIdentifier: "col",

        selectedCard: undefined,

        activeBackground: 2, // id of the image
        leftBackground: 1,
        rightBackground: 3,

        buttons: [],
        buttonClickTimer: 50,

        pieces: [],
    }

    initCollageButtons();
    initCollagePieces();

}

function initCollageButtons() {
    col.buttons = [];
    col.buttons.push(new Button(width / 2 - 700, height / 2 - 700, 420, 420, getCollageImage(col.leftBackground, false)));
    col.buttons.push(new Button(width / 2, height / 2 - 700, 750, 750, getCollageImage(col.activeBackground, true)));
    col.buttons.push(new Button(width / 2 + 700, height / 2 - 700, 420, 420, getCollageImage(col.rightBackground, false)));
}

function initCollagePieces() {
    col.pieces = [];

    // GROUP 1
    col.pieces.push(new CollagePiece(1, 600, 2050, 80, 119));
    col.pieces.push(new CollagePiece(2, 700, 2200, 86, 92));
    col.pieces.push(new CollagePiece(3, 910, 2250, 78, 123));
    col.pieces.push(new CollagePiece(4, 900, 2000, 69, 106));
    col.pieces.push(new CollagePiece(18, 800, 2200, 66, 111));
    col.pieces.push(new CollagePiece(21, 600, 2300, 64, 103));

    // // GROUP 2
    col.pieces.push(new CollagePiece(5, 1200, 2200, 130, 336));
    col.pieces.push(new CollagePiece(6, 1300, 2100, 213, 296));
    col.pieces.push(new CollagePiece(7, 1400, 2150, 148, 383));
    col.pieces.push(new CollagePiece(8, 1500, 2150, 351, 405));
    col.pieces.push(new CollagePiece(20, 1630, 2200, 147, 289));

    // // GROUP 3
    col.pieces.push(new CollagePiece(9, 1200, 2600, 72, 74));
    col.pieces.push(new CollagePiece(10, 1300, 2700, 85, 184));
    col.pieces.push(new CollagePiece(11, 1400, 2900, 51, 44));
    col.pieces.push(new CollagePiece(12, 1460, 2680, 218, 297));
    col.pieces.push(new CollagePiece(23, 1600, 2620, 58, 88));


    // // GROUP 4
    col.pieces.push(new CollagePiece(13, 950, 2550, 218, 297));
    col.pieces.push(new CollagePiece(19, 700, 2820, 394, 420));
    col.pieces.push(new CollagePiece(14, 600, 2800, 203, 195));
    col.pieces.push(new CollagePiece(15, 900, 2750, 150, 160));
    col.pieces.push(new CollagePiece(16, 760, 2700, 164, 205));
    col.pieces.push(new CollagePiece(17, 600, 2600, 175, 203));
}

function getCollageImage(imageId, isFullImage) {
    if (isFullImage) {
        if (imageId === 1) {
            return collageImg1;
        } else if (imageId === 2) {
            return collageImg2;
        } else if (imageId === 3) {
            return collageImg3;
        }
    } else {
        if (imageId === 1) {
            return collageImg1Small;
        } else if (imageId === 2) {
            return collageImg2Small;
        } else if (imageId === 3) {
            return collageImg3Small;
        }
    }
}

function drawCollage() {
    background(collageBg);

    // guiding lines center of the screen.
    // line(0, 840, width, 840);
    // line(0, height - 840, width, height - 840);

    drawCollageHeaderText();

    for (let i = 0; i < col.buttons.length; i++) {
        let currentButton = col.buttons[i];

        // check if background clicked and switch places with the active background.
        if (!isAnySelectedCard() && currentButton.isClicked(mouseX, mouseY) && i !== 1 && col.buttonClickTimer < 0) { // avoid click detection on middle button.
            let activeButton = col.activeBackground;
            if (i === 0) {
                col.activeBackground = col.leftBackground;
                col.leftBackground = activeButton;
            }
            if (i === 2) {
                col.activeBackground = col.rightBackground;
                col.rightBackground = activeButton;
            }
            initCollageButtons();
            col.buttonClickTimer = 50;
            incrementGameOverStats();
        }
        currentButton.isVisible = true;
        currentButton.draw();
    }
    col.buttonClickTimer--;

    push();
    imageMode(CENTER);
    image(collageAreas, width / 2, height / 2 + 500);
    pop();


    // draw pieces
    for (let i = 0; i < col.pieces.length; i++) {
        col.pieces[i].draw();
    }

    // DEBUG - display FPS
    // if (random() > 0.9) {
    //     mem.fps = (mem.fps + frameRate()) / 2; // Get the current frames per second
    // }
    // textSize(16);
    // fill(0);
    // text("FPS: " + mem.fps.toFixed(0), 20, 20);
    // text("ERRORS: " + mem.persistentErrors, 20, 40);

}

function drawCollageHeaderText() {
    textFont(fontNotoMedium);
    textStyle(NORMAL);
    textAlign(CENTER);
    textSize(90);
    fill(0);
    if (language === LANG_RO) {
        text('COLAJ', width / 2, 300);
    } else if (language === LANG_EN) {
        text('COLLAGE', width / 2, 300);
    }

    textSize(45);
    textStyle(BOLD);
    if (language === LANG_RO) {
        text('Creează-ți sportivul fantastic!', width / 2, 400);
    } else if (language === LANG_EN) {
        text('Create your fantastic sportsman!', width / 2, 400);
    }

    textFont(fontNotoLight);
    textStyle(NORMAL);
    if (language === LANG_RO) {
        text('Alege perioada, apoi fă un colaj folosind piesele de mai jos.', width / 2, 450);
    } else if (language === LANG_EN) {
        text('Choose the period, then make a collage using the pieces below.', width / 2, 450);
    }
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++



// ++++++++++++++++++++++ PUZZLE 12 +++++++++++++++++++++++++++++

function initializePuz30GameProps() {
    puz = {
        propertiesIdentifier: "puz30",
        placeholders: [],
        cards: [],

        selectedCard: undefined,

        nextButton: undefined,
        level1Button: undefined,
        level2Button: undefined,
        level3Button: undefined,

        // other puzzles buttons
        otherPuzzlesButtons: [],

        PUZZLE_PIECE_SIZE: 230,
        PUZZLE_AREA_TOP_OFFSET: 1200,

        // card sizes
        CARD_WIDTH: undefined,
        CARD_HEIGHT: undefined,

        // position for the initial placeholders starting the game
        POSY_INITIAL_CARD: undefined,
        POSX_INITIAL_CARD: undefined,
        // position for the initial puzzle deck
        POSX_INITIAL_PUZZLE: undefined,
        POSY_INITIAL_PUZZLE: undefined,

        // position for the deck, how far to enter the canvas.
        POSY_INITIAL_DECK: undefined,

        // this controls the limits within which cards can move on posX
        EASE_IN_FACTOR_DISPERSE_LEFT_LIMIT: -900,
        EASE_IN_FACTOR_DISPERSE_RIGHT_LIMIT: 900,

        // this controls the limits within which cards can move on posY
        POSY_OFFSET_DISPERSE_LEFT_LIMIT: -60,
        POSY_OFFSET_DISPERSE_RIGHT_LIMIT: 60,

        gameState: {
            // id of the current puzzle image.
            puzzleImageId: 1,
            isGameOver: false,
            puzzleRootPath: "puzzle30Img/puzzles",
            allIconsDispersed: false,
            thumbsAlpha: -1,
        },

        finalPuzzleImage: {
            img: undefined, // final whole image after the puzzle is solved.
            opacity: 0,
        },

        cardPopUpProperties: {
            dynamicRadius: 0,
            targetRadius: 30,
            currentSize: 0,
            elasticity: 0.07,
            velocity: 2,
            position: 0,
            inc: 3,
            displayPopUp: false,
            showPropertiesInitialized: false,
            hidePropertiesInitialized: false,
            popupWidth: 900,
            popupHeight: 700,
            popupPosx: 1080,
            popupPosy: 2800,
            currentTitle: "title",
            // 72 chars per line for description.
            currentDescription: "description description description description description description " +
                "\nnew line new line2" +
                "\nnew line new line3" +
                "\nnew line new line4" +
                "\nnew line new line5" +
                "\nnew line new line6",
            currentYear: "9999",
            sportId: 1,
            sportImage: undefined,
        },

    }
}

function initializePuz12GameProps() {
    puz = {
        propertiesIdentifier: "puz12",
        placeholders: [],
        cards: [],

        selectedCard: undefined,

        nextButton: undefined,

        // other puzzles buttons
        otherPuzzlesButtons: [],

        PUZZLE_PIECE_SIZE: 230,
        PUZZLE_AREA_TOP_OFFSET: 1200,

        // card sizes
        CARD_WIDTH: undefined,
        CARD_HEIGHT: undefined,

        // position for the initial placeholders starting the game
        POSY_INITIAL_CARD: undefined,
        POSX_INITIAL_CARD: undefined,
        // position for the initial puzzle deck
        POSX_INITIAL_PUZZLE: undefined,
        POSY_INITIAL_PUZZLE: undefined,

        // position for the deck, how far to enter the canvas.
        POSY_INITIAL_DECK: undefined,

        // this controls the limits within which cards can move on posX
        EASE_IN_FACTOR_DISPERSE_LEFT_LIMIT: -900,
        EASE_IN_FACTOR_DISPERSE_RIGHT_LIMIT: 900,

        // this controls the limits within which cards can move on posY
        POSY_OFFSET_DISPERSE_LEFT_LIMIT: -40,
        POSY_OFFSET_DISPERSE_RIGHT_LIMIT: 40,

        gameState: {
            // id of the current puzzle image.
            puzzleImageId: 1,
            isGameOver: false,
            puzzleRootPath: "puzzle12Img/puzzles",
            allIconsDispersed: false,
            thumbsAlpha: -1,
        },

        finalPuzzleImage: {
            img: undefined, // final whole image after the puzzle is solved.
            opacity: 0,
        },

        cardPopUpProperties: {
            dynamicRadius: 0,
            targetRadius: 30,
            currentSize: 0,
            elasticity: 0.07,
            velocity: 2,
            position: 0,
            inc: 3,
            displayPopUp: false,
            showPropertiesInitialized: false,
            hidePropertiesInitialized: false,
            popupWidth: 900,
            popupHeight: 700,
            popupPosx: 1080,
            popupPosy: 2200,
            currentTitle: "title",
            // 72 chars per line for description.
            currentDescription: "description description description description description description " +
                "\nnew line new line2" +
                "\nnew line new line3" +
                "\nnew line new line4" +
                "\nnew line new line5" +
                "\nnew line new line6",
            currentYear: "9999",
            sportId: 1,
            sportImage: undefined,
        },

    }

}

function initializePuz20GameProps() {
    puz = {
        propertiesIdentifier: "puz20",
        placeholders: [],
        cards: [],

        selectedCard: undefined,

        nextButton: undefined,

        // other puzzles buttons
        otherPuzzlesButtons: [],

        PUZZLE_PIECE_SIZE: 230,
        PUZZLE_AREA_TOP_OFFSET: 1200,

        // card sizes
        CARD_WIDTH: undefined,
        CARD_HEIGHT: undefined,

        // position for the initial placeholders starting the game
        POSY_INITIAL_CARD: undefined,
        POSX_INITIAL_CARD: undefined,
        // position for the initial puzzle deck
        POSX_INITIAL_PUZZLE: undefined,
        POSY_INITIAL_PUZZLE: undefined,

        // position for the deck, how far to enter the canvas.
        POSY_INITIAL_DECK: undefined,

        // this controls the limits within which cards can move on posX
        EASE_IN_FACTOR_DISPERSE_LEFT_LIMIT: -900,
        EASE_IN_FACTOR_DISPERSE_RIGHT_LIMIT: 900,

        // this controls the limits within which cards can move on posY
        POSY_OFFSET_DISPERSE_LEFT_LIMIT: -40,
        POSY_OFFSET_DISPERSE_RIGHT_LIMIT: 40,

        gameState: {
            // id of the current puzzle image.
            puzzleImageId: 1,
            isGameOver: false,
            puzzleRootPath: "puzzle20Img/puzzles",
            allIconsDispersed: false,
            thumbsAlpha: -1,
        },

        finalPuzzleImage: {
            img: undefined, // final whole image after the puzzle is solved.
            opacity: 0,
        },

        cardPopUpProperties: {
            dynamicRadius: 0,
            targetRadius: 30,
            currentSize: 0,
            elasticity: 0.07,
            velocity: 2,
            position: 0,
            inc: 3,
            displayPopUp: false,
            showPropertiesInitialized: false,
            hidePropertiesInitialized: false,
            popupWidth: 900,
            popupHeight: 700,
            popupPosx: 1080,
            popupPosy: 2500,
            currentTitle: "title",
            // 72 chars per line for description.
            currentDescription: "description description description description description description " +
                "\nnew line new line2" +
                "\nnew line new line3" +
                "\nnew line new line4" +
                "\nnew line new line5" +
                "\nnew line new line6",
            currentYear: "9999",
            sportId: 1,
            sportImage: undefined,
        },

    }

}

function initializePuzzle30() {
    createCanvas(SCREEN_WIDTH, SCREEN_HEIGHT);

    puz.CARD_WIDTH = puz.PUZZLE_PIECE_SIZE;
    puz.CARD_HEIGHT = puz.PUZZLE_PIECE_SIZE;

    // puz12.POSX_INITIAL_CARD = width/2;
    // puz12.POSY_INITIAL_CARD = 1300;
    // puz12.POSY_INITIAL_DECK = 3300;

    puz.POSX_INITIAL_PUZZLE = width/2;
    puz.POSY_INITIAL_PUZZLE = height/2 + 1000;

    puz.finalPuzzleImage.img = puzzle30Images[puz.gameState.puzzleImageId - 1][0]; // load the final image based on the id.

    // initialize placeholders.
    puz.placeholders.push(new Placeholder(1,
        this.width/2 + puz.PUZZLE_PIECE_SIZE/2 - puz.PUZZLE_PIECE_SIZE * 3,
        puz.PUZZLE_AREA_TOP_OFFSET,
        puz.PUZZLE_PIECE_SIZE,
        puz.PUZZLE_PIECE_SIZE,
        1, undefined, undefined, puz));
    puz.placeholders.push(new Placeholder(2,
        this.width/2 + puz.PUZZLE_PIECE_SIZE/2 - puz.PUZZLE_PIECE_SIZE * 2,
        puz.PUZZLE_AREA_TOP_OFFSET,
        puz.PUZZLE_PIECE_SIZE,
        puz.PUZZLE_PIECE_SIZE,
        2, undefined, undefined, puz));
    puz.placeholders.push(new Placeholder(3,
        this.width/2 + puz.PUZZLE_PIECE_SIZE/2 - puz.PUZZLE_PIECE_SIZE,
        puz.PUZZLE_AREA_TOP_OFFSET,
        puz.PUZZLE_PIECE_SIZE,
        puz.PUZZLE_PIECE_SIZE,
        3, undefined, undefined, puz));
    puz.placeholders.push(new Placeholder(4,
        this.width/2  + puz.PUZZLE_PIECE_SIZE/2,
        puz.PUZZLE_AREA_TOP_OFFSET,
        puz.PUZZLE_PIECE_SIZE,
        puz.PUZZLE_PIECE_SIZE,
        4, undefined, undefined, puz));
    puz.placeholders.push(new Placeholder(5,
        this.width/2 + puz.PUZZLE_PIECE_SIZE/2 + puz.PUZZLE_PIECE_SIZE,
        puz.PUZZLE_AREA_TOP_OFFSET,
        puz.PUZZLE_PIECE_SIZE,
        puz.PUZZLE_PIECE_SIZE,
        5, undefined, undefined, puz));
    puz.placeholders.push(new Placeholder(6,
        this.width/2  + puz.PUZZLE_PIECE_SIZE/2 + puz.PUZZLE_PIECE_SIZE * 2,
        puz.PUZZLE_AREA_TOP_OFFSET,
        puz.PUZZLE_PIECE_SIZE,
        puz.PUZZLE_PIECE_SIZE,
        6, undefined, undefined, puz));

    puz.placeholders.push(new Placeholder(7,
        this.width/2 + puz.PUZZLE_PIECE_SIZE/2 - puz.PUZZLE_PIECE_SIZE * 3,
        puz.PUZZLE_AREA_TOP_OFFSET + puz.PUZZLE_PIECE_SIZE,
        puz.PUZZLE_PIECE_SIZE,
        puz.PUZZLE_PIECE_SIZE,
        7, undefined, undefined, puz));
    puz.placeholders.push(new Placeholder(8,
        this.width/2 + puz.PUZZLE_PIECE_SIZE/2 - puz.PUZZLE_PIECE_SIZE * 2,
        puz.PUZZLE_AREA_TOP_OFFSET + puz.PUZZLE_PIECE_SIZE,
        puz.PUZZLE_PIECE_SIZE,
        puz.PUZZLE_PIECE_SIZE,
        8, undefined, undefined, puz));
    puz.placeholders.push(new Placeholder(9,
        this.width/2 + puz.PUZZLE_PIECE_SIZE/2 - puz.PUZZLE_PIECE_SIZE ,
        puz.PUZZLE_AREA_TOP_OFFSET + puz.PUZZLE_PIECE_SIZE,
        puz.PUZZLE_PIECE_SIZE,
        puz.PUZZLE_PIECE_SIZE,
        9, undefined, undefined, puz));
    puz.placeholders.push(new Placeholder(10,
        this.width/2  + puz.PUZZLE_PIECE_SIZE/2,
        puz.PUZZLE_AREA_TOP_OFFSET + puz.PUZZLE_PIECE_SIZE,
        puz.PUZZLE_PIECE_SIZE,
        puz.PUZZLE_PIECE_SIZE,
        10, undefined, undefined, puz));
    puz.placeholders.push(new Placeholder(11,
        this.width/2 + puz.PUZZLE_PIECE_SIZE/2 + puz.PUZZLE_PIECE_SIZE,
        puz.PUZZLE_AREA_TOP_OFFSET + puz.PUZZLE_PIECE_SIZE,
        puz.PUZZLE_PIECE_SIZE,
        puz.PUZZLE_PIECE_SIZE,
        11, undefined, undefined, puz));
    puz.placeholders.push(new Placeholder(12,
        this.width/2  + puz.PUZZLE_PIECE_SIZE/2 + puz.PUZZLE_PIECE_SIZE * 2,
        puz.PUZZLE_AREA_TOP_OFFSET + puz.PUZZLE_PIECE_SIZE,
        puz.PUZZLE_PIECE_SIZE,
        puz.PUZZLE_PIECE_SIZE,
        12, undefined, undefined, puz));

    puz.placeholders.push(new Placeholder(13,
        this.width/2 + puz.PUZZLE_PIECE_SIZE/2 - puz.PUZZLE_PIECE_SIZE * 3,
        puz.PUZZLE_AREA_TOP_OFFSET + puz.PUZZLE_PIECE_SIZE * 2,
        puz.PUZZLE_PIECE_SIZE,
        puz.PUZZLE_PIECE_SIZE,
        13, undefined, undefined, puz));
    puz.placeholders.push(new Placeholder(14,
        this.width/2 + puz.PUZZLE_PIECE_SIZE/2 - puz.PUZZLE_PIECE_SIZE * 2,
        puz.PUZZLE_AREA_TOP_OFFSET + puz.PUZZLE_PIECE_SIZE * 2,
        puz.PUZZLE_PIECE_SIZE,
        puz.PUZZLE_PIECE_SIZE,
        14, undefined, undefined, puz));
    puz.placeholders.push(new Placeholder(15,
        this.width/2 + puz.PUZZLE_PIECE_SIZE/2 - puz.PUZZLE_PIECE_SIZE,
        puz.PUZZLE_AREA_TOP_OFFSET + puz.PUZZLE_PIECE_SIZE * 2,
        puz.PUZZLE_PIECE_SIZE,
        puz.PUZZLE_PIECE_SIZE,
        15, undefined, undefined, puz));
    puz.placeholders.push(new Placeholder(16,
        this.width/2  + puz.PUZZLE_PIECE_SIZE/2,
        puz.PUZZLE_AREA_TOP_OFFSET + puz.PUZZLE_PIECE_SIZE * 2,
        puz.PUZZLE_PIECE_SIZE,
        puz.PUZZLE_PIECE_SIZE,
        16, undefined, undefined, puz));
    puz.placeholders.push(new Placeholder(17,
        this.width/2 + puz.PUZZLE_PIECE_SIZE/2 + puz.PUZZLE_PIECE_SIZE,
        puz.PUZZLE_AREA_TOP_OFFSET + puz.PUZZLE_PIECE_SIZE * 2,
        puz.PUZZLE_PIECE_SIZE,
        puz.PUZZLE_PIECE_SIZE,
        17, undefined, undefined, puz));
    puz.placeholders.push(new Placeholder(18,
        this.width/2  + puz.PUZZLE_PIECE_SIZE/2 + puz.PUZZLE_PIECE_SIZE * 2,
        puz.PUZZLE_AREA_TOP_OFFSET + puz.PUZZLE_PIECE_SIZE * 2,
        puz.PUZZLE_PIECE_SIZE,
        puz.PUZZLE_PIECE_SIZE,
        18, undefined, undefined, puz));

    puz.placeholders.push(new Placeholder(19,
        this.width/2 + puz.PUZZLE_PIECE_SIZE/2 - puz.PUZZLE_PIECE_SIZE * 3,
        puz.PUZZLE_AREA_TOP_OFFSET + puz.PUZZLE_PIECE_SIZE * 3,
        puz.PUZZLE_PIECE_SIZE,
        puz.PUZZLE_PIECE_SIZE,
        19, undefined, undefined, puz));
    puz.placeholders.push(new Placeholder(20,
        this.width/2 + puz.PUZZLE_PIECE_SIZE/2 - puz.PUZZLE_PIECE_SIZE * 2,
        puz.PUZZLE_AREA_TOP_OFFSET + puz.PUZZLE_PIECE_SIZE * 3,
        puz.PUZZLE_PIECE_SIZE,
        puz.PUZZLE_PIECE_SIZE,
        20, undefined, undefined, puz));
    puz.placeholders.push(new Placeholder(21,
        this.width/2 + puz.PUZZLE_PIECE_SIZE/2 - puz.PUZZLE_PIECE_SIZE,
        puz.PUZZLE_AREA_TOP_OFFSET + puz.PUZZLE_PIECE_SIZE * 3,
        puz.PUZZLE_PIECE_SIZE,
        puz.PUZZLE_PIECE_SIZE,
        21, undefined, undefined, puz));
    puz.placeholders.push(new Placeholder(22,
        this.width/2  + puz.PUZZLE_PIECE_SIZE/2,
        puz.PUZZLE_AREA_TOP_OFFSET + puz.PUZZLE_PIECE_SIZE * 3,
        puz.PUZZLE_PIECE_SIZE,
        puz.PUZZLE_PIECE_SIZE,
        22, undefined, undefined, puz));
    puz.placeholders.push(new Placeholder(23,
        this.width/2 + puz.PUZZLE_PIECE_SIZE/2 + puz.PUZZLE_PIECE_SIZE,
        puz.PUZZLE_AREA_TOP_OFFSET + puz.PUZZLE_PIECE_SIZE * 3,
        puz.PUZZLE_PIECE_SIZE,
        puz.PUZZLE_PIECE_SIZE,
        23, undefined, undefined, puz));
    puz.placeholders.push(new Placeholder(24,
        this.width/2  + puz.PUZZLE_PIECE_SIZE/2 + puz.PUZZLE_PIECE_SIZE * 2,
        puz.PUZZLE_AREA_TOP_OFFSET + puz.PUZZLE_PIECE_SIZE * 3,
        puz.PUZZLE_PIECE_SIZE,
        puz.PUZZLE_PIECE_SIZE,
        24, undefined, undefined, puz));

    puz.placeholders.push(new Placeholder(25,
        this.width/2 + puz.PUZZLE_PIECE_SIZE/2 - puz.PUZZLE_PIECE_SIZE * 3,
        puz.PUZZLE_AREA_TOP_OFFSET + puz.PUZZLE_PIECE_SIZE * 4,
        puz.PUZZLE_PIECE_SIZE,
        puz.PUZZLE_PIECE_SIZE,
        25, undefined, undefined, puz));
    puz.placeholders.push(new Placeholder(26,
        this.width/2 + puz.PUZZLE_PIECE_SIZE/2 - puz.PUZZLE_PIECE_SIZE * 2,
        puz.PUZZLE_AREA_TOP_OFFSET + puz.PUZZLE_PIECE_SIZE * 4,
        puz.PUZZLE_PIECE_SIZE,
        puz.PUZZLE_PIECE_SIZE,
        26, undefined, undefined, puz));
    puz.placeholders.push(new Placeholder(27,
        this.width/2 + puz.PUZZLE_PIECE_SIZE/2 - puz.PUZZLE_PIECE_SIZE,
        puz.PUZZLE_AREA_TOP_OFFSET + puz.PUZZLE_PIECE_SIZE * 4,
        puz.PUZZLE_PIECE_SIZE,
        puz.PUZZLE_PIECE_SIZE,
        27, undefined, undefined, puz));
    puz.placeholders.push(new Placeholder(28,
        this.width/2  + puz.PUZZLE_PIECE_SIZE/2,
        puz.PUZZLE_AREA_TOP_OFFSET + puz.PUZZLE_PIECE_SIZE * 4,
        puz.PUZZLE_PIECE_SIZE,
        puz.PUZZLE_PIECE_SIZE,
        28, undefined, undefined, puz));
    puz.placeholders.push(new Placeholder(29,
        this.width/2 + puz.PUZZLE_PIECE_SIZE/2 + puz.PUZZLE_PIECE_SIZE,
        puz.PUZZLE_AREA_TOP_OFFSET + puz.PUZZLE_PIECE_SIZE * 4,
        puz.PUZZLE_PIECE_SIZE,
        puz.PUZZLE_PIECE_SIZE,
        29, undefined, undefined, puz));
    puz.placeholders.push(new Placeholder(30,
        this.width/2  + puz.PUZZLE_PIECE_SIZE/2 + puz.PUZZLE_PIECE_SIZE * 2,
        puz.PUZZLE_AREA_TOP_OFFSET + puz.PUZZLE_PIECE_SIZE * 4,
        puz.PUZZLE_PIECE_SIZE,
        puz.PUZZLE_PIECE_SIZE,
        30, undefined, undefined, puz));

    // initialize cards.
    // puz12.POSX_INITIAL_CARD = width/2;
    // puz12.POSY_INITIAL_CARD = 1300;
    // puz12.POSY_INITIAL_DECK = 1300;

    puz.cards.push(initPuzzleCard(1, puz.POSX_INITIAL_PUZZLE, puz.POSY_INITIAL_PUZZLE,
        random(-1, 1), random(-1, 1), puz));
    puz.cards.push(initPuzzleCard(2, puz.POSX_INITIAL_PUZZLE, puz.POSY_INITIAL_PUZZLE,
        random(-1, 1), random(-1, 1), puz));
    puz.cards.push(initPuzzleCard(3, puz.POSX_INITIAL_PUZZLE, puz.POSY_INITIAL_PUZZLE,
        random(-1, 1), random(-1, 1), puz));
    puz.cards.push(initPuzzleCard(4, puz.POSX_INITIAL_PUZZLE, puz.POSY_INITIAL_PUZZLE,
        random(-1, 1), random(-1, 1), puz));
    puz.cards.push(initPuzzleCard(5, puz.POSX_INITIAL_PUZZLE, puz.POSY_INITIAL_PUZZLE,
        random(-1, 1), random(-1, 1), puz));
    puz.cards.push(initPuzzleCard(6, puz.POSX_INITIAL_PUZZLE, puz.POSY_INITIAL_PUZZLE,
        random(-1, 1), random(-1, 1), puz));

    puz.cards.push(initPuzzleCard(7, puz.POSX_INITIAL_PUZZLE, puz.POSY_INITIAL_PUZZLE,
        random(-1, 1), random(-1, 1), puz));
    puz.cards.push(initPuzzleCard(8, puz.POSX_INITIAL_PUZZLE, puz.POSY_INITIAL_PUZZLE,
        random(-1, 1), random(-1, 1), puz));
    puz.cards.push(initPuzzleCard(9, puz.POSX_INITIAL_PUZZLE, puz.POSY_INITIAL_PUZZLE,
        random(-1, 1), random(-1, 1), puz));
    puz.cards.push(initPuzzleCard(10, puz.POSX_INITIAL_PUZZLE, puz.POSY_INITIAL_PUZZLE,
        random(-1, 1), random(-1, 1), puz));
    puz.cards.push(initPuzzleCard(11, puz.POSX_INITIAL_PUZZLE, puz.POSY_INITIAL_PUZZLE,
        random(-1, 1), random(-1, 1), puz));
    puz.cards.push(initPuzzleCard(12, puz.POSX_INITIAL_PUZZLE, puz.POSY_INITIAL_PUZZLE,
        random(-1, 1), random(-1, 1), puz));

    puz.cards.push(initPuzzleCard(13, puz.POSX_INITIAL_PUZZLE, puz.POSY_INITIAL_PUZZLE,
        random(-1, 1), random(-1, 1), puz));
    puz.cards.push(initPuzzleCard(14, puz.POSX_INITIAL_PUZZLE, puz.POSY_INITIAL_PUZZLE,
        random(-1, 1), random(-1, 1), puz));
    puz.cards.push(initPuzzleCard(15, puz.POSX_INITIAL_PUZZLE, puz.POSY_INITIAL_PUZZLE,
        random(-1, 1), random(-1, 1), puz));
    puz.cards.push(initPuzzleCard(16, puz.POSX_INITIAL_PUZZLE, puz.POSY_INITIAL_PUZZLE,
        random(-1, 1), random(-1, 1), puz));
    puz.cards.push(initPuzzleCard(17, puz.POSX_INITIAL_PUZZLE, puz.POSY_INITIAL_PUZZLE,
        random(-1, 1), random(-1, 1), puz));
    puz.cards.push(initPuzzleCard(18, puz.POSX_INITIAL_PUZZLE, puz.POSY_INITIAL_PUZZLE,
        random(-1, 1), random(-1, 1), puz));

    puz.cards.push(initPuzzleCard(19, puz.POSX_INITIAL_PUZZLE, puz.POSY_INITIAL_PUZZLE,
        random(-1, 1), random(-1, 1), puz));
    puz.cards.push(initPuzzleCard(20, puz.POSX_INITIAL_PUZZLE, puz.POSY_INITIAL_PUZZLE,
        random(-1, 1), random(-1, 1), puz));
    puz.cards.push(initPuzzleCard(21, puz.POSX_INITIAL_PUZZLE, puz.POSY_INITIAL_PUZZLE,
        random(-1, 1), random(-1, 1), puz));
    puz.cards.push(initPuzzleCard(22, puz.POSX_INITIAL_PUZZLE, puz.POSY_INITIAL_PUZZLE,
        random(-1, 1), random(-1, 1), puz));
    puz.cards.push(initPuzzleCard(23, puz.POSX_INITIAL_PUZZLE, puz.POSY_INITIAL_PUZZLE,
        random(-1, 1), random(-1, 1), puz));
    puz.cards.push(initPuzzleCard(24, puz.POSX_INITIAL_PUZZLE, puz.POSY_INITIAL_PUZZLE,
        random(-1, 1), random(-1, 1), puz));

    puz.cards.push(initPuzzleCard(25, puz.POSX_INITIAL_PUZZLE, puz.POSY_INITIAL_PUZZLE,
        random(-1, 1), random(-1, 1), puz));
    puz.cards.push(initPuzzleCard(26, puz.POSX_INITIAL_PUZZLE, puz.POSY_INITIAL_PUZZLE,
        random(-1, 1), random(-1, 1), puz));
    puz.cards.push(initPuzzleCard(27, puz.POSX_INITIAL_PUZZLE, puz.POSY_INITIAL_PUZZLE,
        random(-1, 1), random(-1, 1), puz));
    puz.cards.push(initPuzzleCard(28, puz.POSX_INITIAL_PUZZLE, puz.POSY_INITIAL_PUZZLE,
        random(-1, 1), random(-1, 1), puz));
    puz.cards.push(initPuzzleCard(29, puz.POSX_INITIAL_PUZZLE, puz.POSY_INITIAL_PUZZLE,
        random(-1, 1), random(-1, 1), puz));
    puz.cards.push(initPuzzleCard(30, puz.POSX_INITIAL_PUZZLE, puz.POSY_INITIAL_PUZZLE,
        random(-1, 1), random(-1, 1), puz));

    // initialize buttons
    puz.otherPuzzlesButtons.push(new Button(width - 1930, height/2 - 430, 300, 200, undefined));
    puz.otherPuzzlesButtons.push(new Button(width - 1930, height/2 - 650, 300, 200, undefined));

    // initialize puzzle info pop-up details.
    puz.cardPopUpProperties.currentTitle = puzzle30Images[puz.gameState.puzzleImageId - 1][1][language][0];
    puz.cardPopUpProperties.currentDescription = puzzle30Images[puz.gameState.puzzleImageId - 1][1][language][1];
    puz.cardPopUpProperties.currentYear = puzzle30Images[puz.gameState.puzzleImageId - 1][1][language][2];
    puz.cardPopUpProperties.sportId = puzzle30Images[puz.gameState.puzzleImageId - 1][1][language][3];
    puz.cardPopUpProperties.sportImage = loadImage("memoryImg/icons/" + puz.cardPopUpProperties.sportId + ".png");

    if (language === LANG_RO) {
        puz.nextButton = new Button(width/2, height/2 + 1400, 600, 128, puzzleNextButton_ro);
        puz.level1Button = new Button(width - 310, height / 2 + 130, 70, 70, puzLevel12_ro_inactive);
        puz.level2Button = new Button(width - 310, height / 2 + 200, 70, 70, puzLevel20_ro_inactive);
        puz.level3Button = new Button(width - 310, height / 2 + 280, 78, 78, puzLevel30_ro_active);
    } else if (language === LANG_EN) {
        puz.nextButton = new Button(width/2, height/2 + 1400, 600, 128, puzzleNextButton_en);
        puz.level1Button = new Button(width - 310, height / 2 + 130, 70, 70, puzLevel12_en_inactive);
        puz.level2Button = new Button(width - 310, height / 2 + 200, 70, 70, puzLevel20_en_inactive);
        puz.level3Button = new Button(width - 310, height / 2 + 280, 78, 78, puzLevel30_en_active);
    }

    initializeThumbnails();
}

function initializePuzzle12() {
    createCanvas(SCREEN_WIDTH, SCREEN_HEIGHT);

    puz.CARD_WIDTH = puz.PUZZLE_PIECE_SIZE;
    puz.CARD_HEIGHT = puz.PUZZLE_PIECE_SIZE;

    puz.POSX_INITIAL_CARD = width/2;
    puz.POSY_INITIAL_CARD = 1300;
    puz.POSY_INITIAL_DECK = 1300;

    puz.POSX_INITIAL_PUZZLE = width/2;
    puz.POSY_INITIAL_PUZZLE = height/2 + 400;


    print(puz.gameState.puzzleImageId - 1);
    puz.finalPuzzleImage.img = puzzle12Images[puz.gameState.puzzleImageId - 1][0]; // load the final image based on the id.

    // initialize placeholders.
    puz.placeholders.push(new Placeholder(1,
        this.width/2 + puz.PUZZLE_PIECE_SIZE/2 - puz.PUZZLE_PIECE_SIZE * 2,
        puz.PUZZLE_AREA_TOP_OFFSET,
        puz.PUZZLE_PIECE_SIZE,
        puz.PUZZLE_PIECE_SIZE,
        1, undefined, undefined, puz));
    puz.placeholders.push(new Placeholder(2,
        this.width/2 + puz.PUZZLE_PIECE_SIZE/2 - puz.PUZZLE_PIECE_SIZE,
        puz.PUZZLE_AREA_TOP_OFFSET,
        puz.PUZZLE_PIECE_SIZE,
        puz.PUZZLE_PIECE_SIZE,
        2, undefined, undefined, puz));
    puz.placeholders.push(new Placeholder(3,
        this.width/2 + puz.PUZZLE_PIECE_SIZE/2,
        puz.PUZZLE_AREA_TOP_OFFSET,
        puz.PUZZLE_PIECE_SIZE,
        puz.PUZZLE_PIECE_SIZE,
        3, undefined, undefined, puz));
    puz.placeholders.push(new Placeholder(4,
        this.width/2  + puz.PUZZLE_PIECE_SIZE/2 + puz.PUZZLE_PIECE_SIZE,
        puz.PUZZLE_AREA_TOP_OFFSET,
        puz.PUZZLE_PIECE_SIZE,
        puz.PUZZLE_PIECE_SIZE,
        4, undefined, undefined, puz));

    puz.placeholders.push(new Placeholder(5,
        this.width/2 + puz.PUZZLE_PIECE_SIZE/2 - puz.PUZZLE_PIECE_SIZE * 2,
        puz.PUZZLE_AREA_TOP_OFFSET + puz.PUZZLE_PIECE_SIZE,
        puz.PUZZLE_PIECE_SIZE,
        puz.PUZZLE_PIECE_SIZE,
        5, undefined, undefined, puz));
    puz.placeholders.push(new Placeholder(6,
        this.width/2 + puz.PUZZLE_PIECE_SIZE/2 - puz.PUZZLE_PIECE_SIZE,
        puz.PUZZLE_AREA_TOP_OFFSET + puz.PUZZLE_PIECE_SIZE,
        puz.PUZZLE_PIECE_SIZE,
        puz.PUZZLE_PIECE_SIZE,
        6, undefined, undefined, puz));
    puz.placeholders.push(new Placeholder(7,
        this.width/2 + puz.PUZZLE_PIECE_SIZE/2,
        puz.PUZZLE_AREA_TOP_OFFSET + puz.PUZZLE_PIECE_SIZE,
        puz.PUZZLE_PIECE_SIZE,
        puz.PUZZLE_PIECE_SIZE,
        7, undefined, undefined, puz));
    puz.placeholders.push(new Placeholder(8,
        this.width/2  + puz.PUZZLE_PIECE_SIZE/2 + puz.PUZZLE_PIECE_SIZE,
        puz.PUZZLE_AREA_TOP_OFFSET + puz.PUZZLE_PIECE_SIZE,
        puz.PUZZLE_PIECE_SIZE,
        puz.PUZZLE_PIECE_SIZE,
        8, undefined, undefined, puz));

    puz.placeholders.push(new Placeholder(9,
        this.width/2 + puz.PUZZLE_PIECE_SIZE/2 - puz.PUZZLE_PIECE_SIZE * 2,
        puz.PUZZLE_AREA_TOP_OFFSET + puz.PUZZLE_PIECE_SIZE * 2,
        puz.PUZZLE_PIECE_SIZE,
        puz.PUZZLE_PIECE_SIZE,
        9, undefined, undefined, puz));
    puz.placeholders.push(new Placeholder(10,
        this.width/2 + puz.PUZZLE_PIECE_SIZE/2 - puz.PUZZLE_PIECE_SIZE,
        puz.PUZZLE_AREA_TOP_OFFSET + puz.PUZZLE_PIECE_SIZE * 2,
        puz.PUZZLE_PIECE_SIZE,
        puz.PUZZLE_PIECE_SIZE,
        10, undefined, undefined, puz));
    puz.placeholders.push(new Placeholder(11,
        this.width/2 + puz.PUZZLE_PIECE_SIZE/2,
        puz.PUZZLE_AREA_TOP_OFFSET + puz.PUZZLE_PIECE_SIZE * 2,
        puz.PUZZLE_PIECE_SIZE,
        puz.PUZZLE_PIECE_SIZE,
        11, undefined, undefined, puz));
    puz.placeholders.push(new Placeholder(12,
        this.width/2  + puz.PUZZLE_PIECE_SIZE/2 + puz.PUZZLE_PIECE_SIZE,
        puz.PUZZLE_AREA_TOP_OFFSET + puz.PUZZLE_PIECE_SIZE * 2,
        puz.PUZZLE_PIECE_SIZE,
        puz.PUZZLE_PIECE_SIZE,
        12, undefined, undefined, puz));

    // initialize cards.
    puz.POSX_INITIAL_CARD = width/2;
    puz.POSY_INITIAL_CARD = 1300;
    puz.POSY_INITIAL_DECK = 1300;

    puz.cards.push(initPuzzleCard(1, puz.POSX_INITIAL_PUZZLE, puz.POSY_INITIAL_PUZZLE,
        random(-1, 1), random(-1, 1), puz));
    puz.cards.push(initPuzzleCard(2, puz.POSX_INITIAL_PUZZLE, puz.POSY_INITIAL_PUZZLE,
        random(-1, 1), random(-1, 1), puz));
    puz.cards.push(initPuzzleCard(3, puz.POSX_INITIAL_PUZZLE, puz.POSY_INITIAL_PUZZLE,
        random(-1, 1), random(-1, 1), puz));
    puz.cards.push(initPuzzleCard(4, puz.POSX_INITIAL_PUZZLE, puz.POSY_INITIAL_PUZZLE,
        random(-1, 1), random(-1, 1), puz));

    puz.cards.push(initPuzzleCard(5, puz.POSX_INITIAL_PUZZLE, puz.POSY_INITIAL_PUZZLE,
        random(-1, 1), random(-1, 1), puz));
    puz.cards.push(initPuzzleCard(6, puz.POSX_INITIAL_PUZZLE, puz.POSY_INITIAL_PUZZLE,
        random(-1, 1), random(-1, 1), puz));
    puz.cards.push(initPuzzleCard(7, puz.POSX_INITIAL_PUZZLE, puz.POSY_INITIAL_PUZZLE,
        random(-1, 1), random(-1, 1), puz));
    puz.cards.push(initPuzzleCard(8, puz.POSX_INITIAL_PUZZLE, puz.POSY_INITIAL_PUZZLE,
        random(-1, 1), random(-1, 1), puz));

    puz.cards.push(initPuzzleCard(9, puz.POSX_INITIAL_PUZZLE, puz.POSY_INITIAL_PUZZLE,
        random(-1, 1), random(-1, 1), puz));
    puz.cards.push(initPuzzleCard(10, puz.POSX_INITIAL_PUZZLE, puz.POSY_INITIAL_PUZZLE,
        random(-1, 1), random(-1, 1), puz));
    puz.cards.push(initPuzzleCard(11, puz.POSX_INITIAL_PUZZLE, puz.POSY_INITIAL_PUZZLE,
        random(-1, 1), random(-1, 1), puz));
    puz.cards.push(initPuzzleCard(12, puz.POSX_INITIAL_PUZZLE, puz.POSY_INITIAL_PUZZLE,
        random(-1, 1), random(-1, 1), puz));

    // initialize buttons
    puz.otherPuzzlesButtons.push(new Button(width - 1720, height/2 - 430, 300, 200, undefined));
    puz.otherPuzzlesButtons.push(new Button(width - 1720, height/2 - 650, 300, 200, undefined));

    // initialize puzzle info pop-up details.
    puz.cardPopUpProperties.currentTitle = puzzle12Images[puz.gameState.puzzleImageId - 1][1][language][0];
    puz.cardPopUpProperties.currentDescription = puzzle12Images[puz.gameState.puzzleImageId - 1][1][language][1];
    puz.cardPopUpProperties.currentYear = puzzle12Images[puz.gameState.puzzleImageId - 1][1][language][2];
    puz.cardPopUpProperties.sportId = puzzle12Images[puz.gameState.puzzleImageId - 1][1][language][3];
    puz.cardPopUpProperties.sportImage = loadImage("memoryImg/icons/" + puz.cardPopUpProperties.sportId + ".png");

    if (language === LANG_RO) {
        puz.nextButton = new Button(width/2, height/2 + 780, 600, 128, puzzleNextButton_ro);
        puz.level1Button = new Button(width - 540, height / 2 - 328, 70, 70, puzLevel12_ro_active);
        puz.level2Button = new Button(width - 540, height / 2 - 250, 70, 70, puzLevel20_ro_inactive);
        puz.level3Button = new Button(width - 540, height / 2 - 185, 78, 78, puzLevel30_ro_inactive);
    } else if (language === LANG_EN) {
        puz.nextButton = new Button(width/2, height/2 + 780, 600, 128, puzzleNextButton_en);
        puz.level1Button = new Button(width - 540, height / 2 - 328, 70, 70, puzLevel12_en_active);
        puz.level2Button = new Button(width - 540, height / 2 - 250, 70, 70, puzLevel20_en_inactive);
        puz.level3Button = new Button(width - 540, height / 2 - 185, 78, 78, puzLevel30_en_inactive);
    }

    initializeThumbnails();
}

function initializePuzzle20() {
    createCanvas(SCREEN_WIDTH, SCREEN_HEIGHT);

    puz.CARD_WIDTH = puz.PUZZLE_PIECE_SIZE;
    puz.CARD_HEIGHT = puz.PUZZLE_PIECE_SIZE;

    // puz12.POSX_INITIAL_CARD = width/2;
    // puz12.POSY_INITIAL_CARD = 1300;
    // puz12.POSY_INITIAL_DECK = 3300;

    puz.POSX_INITIAL_PUZZLE = width/2;
    puz.POSY_INITIAL_PUZZLE = height/2 + 600;

    print(puz.gameState.puzzleImageId - 1);
    puz.finalPuzzleImage.img = puzzle20Images[puz.gameState.puzzleImageId - 1][0]; // load the final image based on the id.

    // initialize placeholders.
    puz.placeholders.push(new Placeholder(1,
        this.width/2 + puz.PUZZLE_PIECE_SIZE/2 - puz.PUZZLE_PIECE_SIZE * 3,
        puz.PUZZLE_AREA_TOP_OFFSET,
        puz.PUZZLE_PIECE_SIZE,
        puz.PUZZLE_PIECE_SIZE,
        1, undefined, undefined, puz));
    puz.placeholders.push(new Placeholder(2,
        this.width/2 + puz.PUZZLE_PIECE_SIZE/2 - puz.PUZZLE_PIECE_SIZE * 2,
        puz.PUZZLE_AREA_TOP_OFFSET,
        puz.PUZZLE_PIECE_SIZE,
        puz.PUZZLE_PIECE_SIZE,
        2, undefined, undefined, puz));
    puz.placeholders.push(new Placeholder(3,
        this.width/2 + puz.PUZZLE_PIECE_SIZE/2 - puz.PUZZLE_PIECE_SIZE,
        puz.PUZZLE_AREA_TOP_OFFSET,
        puz.PUZZLE_PIECE_SIZE,
        puz.PUZZLE_PIECE_SIZE,
        3, undefined, undefined, puz));
    puz.placeholders.push(new Placeholder(4,
        this.width/2  + puz.PUZZLE_PIECE_SIZE/2,
        puz.PUZZLE_AREA_TOP_OFFSET,
        puz.PUZZLE_PIECE_SIZE,
        puz.PUZZLE_PIECE_SIZE,
        4, undefined, undefined, puz));
    puz.placeholders.push(new Placeholder(5,
        this.width/2 + puz.PUZZLE_PIECE_SIZE/2 + puz.PUZZLE_PIECE_SIZE,
        puz.PUZZLE_AREA_TOP_OFFSET,
        puz.PUZZLE_PIECE_SIZE,
        puz.PUZZLE_PIECE_SIZE,
        5, undefined, undefined, puz));

    puz.placeholders.push(new Placeholder(6,
        this.width/2 + puz.PUZZLE_PIECE_SIZE/2 - puz.PUZZLE_PIECE_SIZE * 3,
        puz.PUZZLE_AREA_TOP_OFFSET + puz.PUZZLE_PIECE_SIZE,
        puz.PUZZLE_PIECE_SIZE,
        puz.PUZZLE_PIECE_SIZE,
        6, undefined, undefined, puz));
    puz.placeholders.push(new Placeholder(7,
        this.width/2 + puz.PUZZLE_PIECE_SIZE/2 - puz.PUZZLE_PIECE_SIZE * 2,
        puz.PUZZLE_AREA_TOP_OFFSET + puz.PUZZLE_PIECE_SIZE,
        puz.PUZZLE_PIECE_SIZE,
        puz.PUZZLE_PIECE_SIZE,
        7, undefined, undefined, puz));
    puz.placeholders.push(new Placeholder(8,
        this.width/2 + puz.PUZZLE_PIECE_SIZE/2 - puz.PUZZLE_PIECE_SIZE ,
        puz.PUZZLE_AREA_TOP_OFFSET + puz.PUZZLE_PIECE_SIZE,
        puz.PUZZLE_PIECE_SIZE,
        puz.PUZZLE_PIECE_SIZE,
        8, undefined, undefined, puz));
    puz.placeholders.push(new Placeholder(9,
        this.width/2  + puz.PUZZLE_PIECE_SIZE/2,
        puz.PUZZLE_AREA_TOP_OFFSET + puz.PUZZLE_PIECE_SIZE,
        puz.PUZZLE_PIECE_SIZE,
        puz.PUZZLE_PIECE_SIZE,
        9, undefined, undefined, puz));
    puz.placeholders.push(new Placeholder(10,
        this.width/2 + puz.PUZZLE_PIECE_SIZE/2 + puz.PUZZLE_PIECE_SIZE,
        puz.PUZZLE_AREA_TOP_OFFSET + puz.PUZZLE_PIECE_SIZE,
        puz.PUZZLE_PIECE_SIZE,
        puz.PUZZLE_PIECE_SIZE,
        10, undefined, undefined, puz));

    puz.placeholders.push(new Placeholder(11,
        this.width/2 + puz.PUZZLE_PIECE_SIZE/2 - puz.PUZZLE_PIECE_SIZE * 3,
        puz.PUZZLE_AREA_TOP_OFFSET + puz.PUZZLE_PIECE_SIZE * 2,
        puz.PUZZLE_PIECE_SIZE,
        puz.PUZZLE_PIECE_SIZE,
        11, undefined, undefined, puz));
    puz.placeholders.push(new Placeholder(12,
        this.width/2 + puz.PUZZLE_PIECE_SIZE/2 - puz.PUZZLE_PIECE_SIZE * 2,
        puz.PUZZLE_AREA_TOP_OFFSET + puz.PUZZLE_PIECE_SIZE * 2,
        puz.PUZZLE_PIECE_SIZE,
        puz.PUZZLE_PIECE_SIZE,
        12, undefined, undefined, puz));
    puz.placeholders.push(new Placeholder(13,
        this.width/2 + puz.PUZZLE_PIECE_SIZE/2 - puz.PUZZLE_PIECE_SIZE,
        puz.PUZZLE_AREA_TOP_OFFSET + puz.PUZZLE_PIECE_SIZE * 2,
        puz.PUZZLE_PIECE_SIZE,
        puz.PUZZLE_PIECE_SIZE,
        13, undefined, undefined, puz));
    puz.placeholders.push(new Placeholder(14,
        this.width/2  + puz.PUZZLE_PIECE_SIZE/2,
        puz.PUZZLE_AREA_TOP_OFFSET + puz.PUZZLE_PIECE_SIZE * 2,
        puz.PUZZLE_PIECE_SIZE,
        puz.PUZZLE_PIECE_SIZE,
        14, undefined, undefined, puz));
    puz.placeholders.push(new Placeholder(15,
        this.width/2 + puz.PUZZLE_PIECE_SIZE/2 + puz.PUZZLE_PIECE_SIZE,
        puz.PUZZLE_AREA_TOP_OFFSET + puz.PUZZLE_PIECE_SIZE * 2,
        puz.PUZZLE_PIECE_SIZE,
        puz.PUZZLE_PIECE_SIZE,
        15, undefined, undefined, puz));

    puz.placeholders.push(new Placeholder(16,
        this.width/2 + puz.PUZZLE_PIECE_SIZE/2 - puz.PUZZLE_PIECE_SIZE * 3,
        puz.PUZZLE_AREA_TOP_OFFSET + puz.PUZZLE_PIECE_SIZE * 3,
        puz.PUZZLE_PIECE_SIZE,
        puz.PUZZLE_PIECE_SIZE,
        16, undefined, undefined, puz));
    puz.placeholders.push(new Placeholder(17,
        this.width/2 + puz.PUZZLE_PIECE_SIZE/2 - puz.PUZZLE_PIECE_SIZE * 2,
        puz.PUZZLE_AREA_TOP_OFFSET + puz.PUZZLE_PIECE_SIZE * 3,
        puz.PUZZLE_PIECE_SIZE,
        puz.PUZZLE_PIECE_SIZE,
        17, undefined, undefined, puz));
    puz.placeholders.push(new Placeholder(18,
        this.width/2 + puz.PUZZLE_PIECE_SIZE/2 - puz.PUZZLE_PIECE_SIZE,
        puz.PUZZLE_AREA_TOP_OFFSET + puz.PUZZLE_PIECE_SIZE * 3,
        puz.PUZZLE_PIECE_SIZE,
        puz.PUZZLE_PIECE_SIZE,
        18, undefined, undefined, puz));
    puz.placeholders.push(new Placeholder(19,
        this.width/2  + puz.PUZZLE_PIECE_SIZE/2,
        puz.PUZZLE_AREA_TOP_OFFSET + puz.PUZZLE_PIECE_SIZE * 3,
        puz.PUZZLE_PIECE_SIZE,
        puz.PUZZLE_PIECE_SIZE,
        19, undefined, undefined, puz));
    puz.placeholders.push(new Placeholder(20,
        this.width/2 + puz.PUZZLE_PIECE_SIZE/2 + puz.PUZZLE_PIECE_SIZE,
        puz.PUZZLE_AREA_TOP_OFFSET + puz.PUZZLE_PIECE_SIZE * 3,
        puz.PUZZLE_PIECE_SIZE,
        puz.PUZZLE_PIECE_SIZE,
        20, undefined, undefined, puz));

    // initialize cards.
    // puz12.POSX_INITIAL_CARD = width/2;
    // puz12.POSY_INITIAL_CARD = 1300;
    // puz12.POSY_INITIAL_DECK = 1300;

    puz.cards.push(initPuzzleCard(1, puz.POSX_INITIAL_PUZZLE, puz.POSY_INITIAL_PUZZLE,
        random(-1, 1), random(-1, 1), puz));
    puz.cards.push(initPuzzleCard(2, puz.POSX_INITIAL_PUZZLE, puz.POSY_INITIAL_PUZZLE,
        random(-1, 1), random(-1, 1), puz));
    puz.cards.push(initPuzzleCard(3, puz.POSX_INITIAL_PUZZLE, puz.POSY_INITIAL_PUZZLE,
        random(-1, 1), random(-1, 1), puz));
    puz.cards.push(initPuzzleCard(4, puz.POSX_INITIAL_PUZZLE, puz.POSY_INITIAL_PUZZLE,
        random(-1, 1), random(-1, 1), puz));
    puz.cards.push(initPuzzleCard(5, puz.POSX_INITIAL_PUZZLE, puz.POSY_INITIAL_PUZZLE,
        random(-1, 1), random(-1, 1), puz));

    puz.cards.push(initPuzzleCard(6, puz.POSX_INITIAL_PUZZLE, puz.POSY_INITIAL_PUZZLE,
        random(-1, 1), random(-1, 1), puz));
    puz.cards.push(initPuzzleCard(7, puz.POSX_INITIAL_PUZZLE, puz.POSY_INITIAL_PUZZLE,
        random(-1, 1), random(-1, 1), puz));
    puz.cards.push(initPuzzleCard(8, puz.POSX_INITIAL_PUZZLE, puz.POSY_INITIAL_PUZZLE,
        random(-1, 1), random(-1, 1), puz));
    puz.cards.push(initPuzzleCard(9, puz.POSX_INITIAL_PUZZLE, puz.POSY_INITIAL_PUZZLE,
        random(-1, 1), random(-1, 1), puz));
    puz.cards.push(initPuzzleCard(10, puz.POSX_INITIAL_PUZZLE, puz.POSY_INITIAL_PUZZLE,
        random(-1, 1), random(-1, 1), puz));

    puz.cards.push(initPuzzleCard(11, puz.POSX_INITIAL_PUZZLE, puz.POSY_INITIAL_PUZZLE,
        random(-1, 1), random(-1, 1), puz));
    puz.cards.push(initPuzzleCard(12, puz.POSX_INITIAL_PUZZLE, puz.POSY_INITIAL_PUZZLE,
        random(-1, 1), random(-1, 1), puz));
    puz.cards.push(initPuzzleCard(13, puz.POSX_INITIAL_PUZZLE, puz.POSY_INITIAL_PUZZLE,
        random(-1, 1), random(-1, 1), puz));
    puz.cards.push(initPuzzleCard(14, puz.POSX_INITIAL_PUZZLE, puz.POSY_INITIAL_PUZZLE,
        random(-1, 1), random(-1, 1), puz));
    puz.cards.push(initPuzzleCard(15, puz.POSX_INITIAL_PUZZLE, puz.POSY_INITIAL_PUZZLE,
        random(-1, 1), random(-1, 1), puz));

    puz.cards.push(initPuzzleCard(16, puz.POSX_INITIAL_PUZZLE, puz.POSY_INITIAL_PUZZLE,
        random(-1, 1), random(-1, 1), puz));
    puz.cards.push(initPuzzleCard(17, puz.POSX_INITIAL_PUZZLE, puz.POSY_INITIAL_PUZZLE,
        random(-1, 1), random(-1, 1), puz));
    puz.cards.push(initPuzzleCard(18, puz.POSX_INITIAL_PUZZLE, puz.POSY_INITIAL_PUZZLE,
        random(-1, 1), random(-1, 1), puz));
    puz.cards.push(initPuzzleCard(19, puz.POSX_INITIAL_PUZZLE, puz.POSY_INITIAL_PUZZLE,
        random(-1, 1), random(-1, 1), puz));
    puz.cards.push(initPuzzleCard(20, puz.POSX_INITIAL_PUZZLE, puz.POSY_INITIAL_PUZZLE,
        random(-1, 1), random(-1, 1), puz));

    // initialize buttons
    puz.otherPuzzlesButtons.push(new Button(width - 1930, height/2 - 430, 300, 200, undefined));
    puz.otherPuzzlesButtons.push(new Button(width - 1930, height/2 - 650, 300, 200, undefined));

    // initialize puzzle info pop-up details.
    puz.cardPopUpProperties.currentTitle = puzzle30Images[puz.gameState.puzzleImageId - 1][1][language][0];
    puz.cardPopUpProperties.currentDescription = puzzle30Images[puz.gameState.puzzleImageId - 1][1][language][1];
    puz.cardPopUpProperties.currentYear = puzzle30Images[puz.gameState.puzzleImageId - 1][1][language][2];
    puz.cardPopUpProperties.sportId = puzzle30Images[puz.gameState.puzzleImageId - 1][1][language][3];
    puz.cardPopUpProperties.sportImage = loadImage("memoryImg/icons/" + puz.cardPopUpProperties.sportId + ".png");

    if (language === LANG_RO) {
        puz.nextButton = new Button(width/2, height/2 + 1400, 600, 128, puzzleNextButton_ro);
        puz.level1Button = new Button(width - 540, height / 2 - 100, 70, 70, puzLevel12_ro_inactive);
        puz.level2Button = new Button(width - 540, height / 2 - 25, 70, 70, puzLevel20_ro_active);
        puz.level3Button = new Button(width - 540, height / 2 + 50, 78, 78, puzLevel30_ro_inactive);
    } else if (language === LANG_EN) {
        puz.nextButton = new Button(width/2, height/2 + 1400, 600, 128, puzzleNextButton_en);
        puz.level1Button = new Button(width - 540, height / 2 - 100, 70, 70, puzLevel12_en_inactive);
        puz.level2Button = new Button(width - 540, height / 2 - 25, 70, 70, puzLevel20_en_active);
        puz.level3Button = new Button(width - 540, height / 2 + 50, 78, 78, puzLevel30_en_inactive);
    }

    initializeThumbnails();
}

function drawPuzzle() {
    background(puzzleBg);

    // guiding lines center of the screen.
    // stroke(1);
    // strokeWeight(2);
    // line(0, 840, width, 840);
    // line(0, height-840, width, height-840);

    drawPlaceholders();
    drawCards();

    if (activeGame === "puz12" || activeGame === "puz20") {
        drawPuzzlePreview();
    }
    drawThumbPuzzles();
    drawLevelButton();
    // check correct placements.
    checkPuzzlePlaceholderCards();

    // check is end of the game and perform cleanup and final display.
    checkEndOfTheGame();
    drawPopUp(puz);

    if (puz.nextButton.isVisible && puz.nextButton.isClicked(mouseX, mouseY)) {
        // reset puzzle with new image.
        let newActivePuzzleId = puz.gameState.puzzleImageId + 1;
        if (activeGame === "puz12") {
            initializePuz12GameProps();
        } else if (activeGame === "puz20") {
            initializePuz20GameProps();
        } else if (activeGame === "puz30") {
            initializePuz30GameProps();
        }
        puz.gameState.puzzleImageId = newActivePuzzleId > 3 ? 1 : newActivePuzzleId;
        puz.isInitialized = false;
        if (activeGame === "puz12") {
            initializePuzzle12();
        } else if (activeGame === "puz20") {
            initializePuzzle20();
        } else if (activeGame === "puz30") {
            initializePuzzle30();
        }
        puz.isInitialized = true;
    }
    puz.nextButton.draw();

    textFont(fontNotoMedium);
    textStyle(NORMAL);
    textAlign(CENTER);
    textSize(90);
    fill(0);
    text('PUZZLE', width/2, 300);

    textSize(45);
    textStyle(BOLD);
    let text1 = 'Recompune piesă cu piesă momente marcante din sportul brașovean.';
    if (language === LANG_EN) {
        text1 = 'Piece by piece, recreate significant moments for sports in Brașov.';
    }
    text(text1, width/2, 400);

    textFont(fontNotoLight);
    textStyle(NORMAL);
    let text2 = 'Poți alege nivelul de dificultate: cu 12, 20 sau 30 de piese.';
    if (language === LANG_EN) {
        text2 = 'You can choose the difficulty level: with 12, 20 or 30 pieces.';
    }
    text(text2, width/2, 450);

    fill('#AAAAAA');
    textSize(32);

    let choose_new_text;
    let left_offset = 0;
    if (language === LANG_RO) {
        choose_new_text = "Alege alt puzzle";
    } else if (language === LANG_EN) {
        choose_new_text = "Choose another";
        left_offset = 0;
    }
    if (activeGame === "puz12") {
        noStroke();
        text(choose_new_text, 460 + left_offset, height/2 - 800);
    } else if (activeGame === "puz20") {
        noStroke();
        text(choose_new_text, 230 + left_offset, height/2 - 800);
    } else if (activeGame === "puz30") {
        noStroke();
        text(choose_new_text, 230 + left_offset, height/2 - 800);
    }
}

function drawLevelButton() {
    // draw buttons background
    let puzButtonBgPosx = 0;
    let puzButtonBgPosy = 0;
    if (activeGame === "puz12") {
        puzButtonBgPosx = width - 540;
        puzButtonBgPosy = height / 2 - 270;
    } else if (activeGame === "puz20"){
        puzButtonBgPosx = width - 540;
        puzButtonBgPosy = height / 2 - 40;
    } else if (activeGame === "puz30") {
        puzButtonBgPosx = width - 310;
        puzButtonBgPosy = height / 2 + 190;
    }
    push();
    imageMode(CENTER);
    if (language === LANG_RO) {
        image(puzButtonBg_ro, puzButtonBgPosx, puzButtonBgPosy);
    } else if (language === LANG_EN) {
        image(puzButtonBg_en, puzButtonBgPosx, puzButtonBgPosy);
    }
    pop();


    puz.level1Button.isVisible = true;
    puz.level2Button.isVisible = true;
    puz.level3Button.isVisible = true;
    puz.level1Button.draw();
    puz.level2Button.draw();
    puz.level3Button.draw();

    if (puz.level1Button.isClicked(mouseX, mouseY) && puz.selectedCard === undefined) {
        puz.isInitialized = false;
        activeGame = "puz12";
        let currentPuzzleId = puz.gameState.puzzleImageId;
        initializePuz12GameProps();
        puz.gameState.puzzleImageId = currentPuzzleId;
        initializePuzzle12();
        puz.isInitialized = true;
        print("times played: " + getItem(activeGame));
    } else if (puz.level2Button.isClicked(mouseX, mouseY) && puz.selectedCard === undefined) {
        puz.isInitialized = false;
        activeGame = "puz20";
        let currentPuzzleId = puz.gameState.puzzleImageId;
        initializePuz20GameProps();
        puz.gameState.puzzleImageId = currentPuzzleId;
        initializePuzzle20();
        puz.isInitialized = true;
        print("times played: " + getItem(activeGame));
    } else if (puz.level3Button.isClicked(mouseX, mouseY) && puz.selectedCard === undefined) {
        puz.isInitialized = false;
        activeGame = "puz30";
        let currentPuzzleId = puz.gameState.puzzleImageId;
        initializePuz30GameProps();
        puz.gameState.puzzleImageId = currentPuzzleId;
        initializePuzzle30();
        puz.isInitialized = true;
        print("times played: " + getItem(activeGame));
    }
}

function initializeThumbnails() {
    let localIndex = 0;
    for (let i = 1; i < 4; i++) {
        if (i !== puz.gameState.puzzleImageId) {

            if (activeGame === "puz12") {
                puz.otherPuzzlesButtons[localIndex].img = puzzle12Thumbs[i - 1];
            } else if (activeGame === "puz20") {
                puz.otherPuzzlesButtons[localIndex].img = puzzle20Thumbs[i - 1];
            } else if (activeGame === "puz30") {
                puz.otherPuzzlesButtons[localIndex].img = puzzle30Thumbs[i - 1];
            }
            puz.otherPuzzlesButtons[localIndex].isVisible = true;
            puz.otherPuzzlesButtons[localIndex].id = i;
            localIndex++;
        }
    }
}

function drawThumbPuzzles() {
    for (let i = 0; i < puz.otherPuzzlesButtons.length; i++) {

        push();
        if (puz.gameState.thumbsAlpha < 1) {
            puz.gameState.thumbsAlpha += 0.005;
        }
        tint(255, puz.gameState.thumbsAlpha * 255);
        puz.otherPuzzlesButtons[i].draw();
        pop();

        // check click only after puzzles are dispersed in order to avoid clicking on multiple thumbs before current puzzle is loaded.
        if (puz.gameState.allIconsDispersed && puz.otherPuzzlesButtons[i].isClicked(mouseX, mouseY) && puz.selectedCard === undefined) {
            let newActivePuzzleId = puz.otherPuzzlesButtons[i].id;

            // 'manually' reset puzzle game cu inject puzzle button id.
            if (activeGame === "puz12") {
                initializePuz12GameProps();
            } else if (activeGame === "puz20") {
                initializePuz20GameProps();
            } else if (activeGame === "puz30") {
                initializePuz30GameProps();
            }
            puz.gameState.puzzleImageId = newActivePuzzleId;
            puz.isInitialized = false;
            if (activeGame === "puz12"){
                initializePuzzle12();
            } else if (activeGame === "puz20") {
                initializePuzzle20();
            } else if (activeGame === "puz30") {
                initializePuzzle30();
            }
            puz.isInitialized = true;
        }
    }
}

function drawPuzzlePreview() {
    push();
    if (puz.gameState.thumbsAlpha < 1) {
        puz.gameState.thumbsAlpha += 0.005;
    }
    if (activeGame === "puz12") {
        scale(0.5);
        tint(255, puz.gameState.thumbsAlpha * 255);
        image(puz.finalPuzzleImage.img, this.width + 1000, this.height/2 + 270);
    } else if (activeGame === "puz20") {
        scale(0.4);
        tint(255, puz.gameState.thumbsAlpha * 255);
        image(puz.finalPuzzleImage.img, this.width + 1800, this.height/2 + 800);
    }

    pop();
}

function initPuzzleCard(id, posx, posy, disperseX, disperseY, gameProp) {
    let card = new Puzzle(id, posx, posy, disperseX, disperseY, gameProp, gameProp.gameState.puzzleRootPath);
    card.enableRotation = false;
    card.shouldScaleWhenActive = false;
    return card;
}

function drawPlaceholders() {
    let counterMatches = 0;
    for (let i = 0; i < puz.placeholders.length; i++) {
        let currentPlaceholder = puz.placeholders[i];
        currentPlaceholder.draw();

        // check how many cards match.
        if (currentPlaceholder.activeCard !== undefined
            && currentPlaceholder.activeCard.id === currentPlaceholder.correctCardId) {
            counterMatches++;
        }
    }

    if (counterMatches === puz.cards.length) {
        puz.gameState.isGameOver = true;
    }
}

function drawCards() {

    // initialize and display the cards.
    puz.gameState.allIconsDispersed = true;
    for (let i = 0; i < puz.cards.length; i++) {
        let currentCard = puz.cards[i];

        if (!currentCard.dispersed) {
            currentCard.disperse();
        } else if (currentCard.shouldBeReturned) {
            currentCard.returnToScatteredPosition();
        } else {
            currentCard.draw();
        }
        puz.gameState.allIconsDispersed = puz.gameState.allIconsDispersed && currentCard.dispersed;
    }
}


function checkEndOfTheGame() {
    if (puz.gameState.isGameOver) {

        // start fading in the final image
        if (puz.finalPuzzleImage.opacity < 1) {
            puz.finalPuzzleImage.opacity += 0.01;
        }
        tint(255, map(puz.finalPuzzleImage.opacity, 0, 1, 0, 255));
        if (activeGame === "puz12") {
            image(puz.finalPuzzleImage.img, this.width/2 - puz.PUZZLE_PIECE_SIZE * 2,
                puz.PUZZLE_AREA_TOP_OFFSET - puz.PUZZLE_PIECE_SIZE/2);
        } else if (activeGame === "puz20") {
            image(puz.finalPuzzleImage.img, this.width/2 - puz.PUZZLE_PIECE_SIZE * 3,
                puz.PUZZLE_AREA_TOP_OFFSET - puz.PUZZLE_PIECE_SIZE/2);
        } else if (activeGame === "puz30") {
            image(puz.finalPuzzleImage.img, this.width/2 - puz.PUZZLE_PIECE_SIZE * 3,
                puz.PUZZLE_AREA_TOP_OFFSET - puz.PUZZLE_PIECE_SIZE/2);
        }
        tint(255, 255);

        // when final image has finished fading in, remove all puzzle pieces.
        if (puz.finalPuzzleImage.opacity > 1 && puz.cards.length > 0) {
            puz.cards = [];
            puz.placeholders = [];
        }

        // display info pop-up
        initShowPopUp(puz);
        puz.nextButton.isVisible = true;

        incrementGameOverStats();
    }


}

function checkPuzzlePlaceholderCards() {
    // reset cards active placeholders and set them later together with the placeholder settings.
    for (let i = 0; i < puz.cards.length; i++) {
        puz.cards[i].activePlaceholder = undefined;
    }

    for (let i = 0; i < puz.placeholders.length; i++) {
        let currentPlaceholder = puz.placeholders[i];
        currentPlaceholder.activeCard = undefined;
        // currentPlaceholder.draw();

        // check if card should be snapped into placeholder.
        for (let i = 0; i < puz.cards.length; i++) {
            let currentCard = puz.cards[i];
            if (currentPlaceholder.isCardOver(currentCard) && currentPlaceholder.activeCard === undefined
                && !isAnySelectedCard() && currentCard.id === currentPlaceholder.correctCardId) {
                // set active card and placeholder to each other.
                currentPlaceholder.activeCard = currentCard;
                currentCard.activePlaceholder = currentPlaceholder;
            }
        }
    }
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


// *********** MOUSE AND TOUCH EVENTS **************************

// desktop support
function mousePressed() {
    fullscreen(true);
    idleTimer = IDLE_TIMEOUT_INTERACTION;
    if (activeGame === mem.propertiesIdentifier) {
        checkInfoPopUpClosed(mem);
        initHidePopUp(mem);
        // restart game.
        if (mem.gameState.isGameOver && mouseX > 800 && mouseX < 1330 && mouseY > 2370 && mouseY < 2450) {
            resetCurrentGame()
        }
    }
    if (activeGame === tl.propertiesIdentifier) {
        touchStarted();
        // restart game.
        if (isGameOver() && mouseX > 800 && mouseX < 1330 && mouseY > 2370 && mouseY < 2450) {
            resetCurrentGame()
        }
    }

    // hide menu if visible and clicked outside menu.
    if (menu.isVisible && mouseX < width - menu.fixedPosition) {
        menu.isVisible = false;
    }
}

function touchEnded() {
    fullscreen(true);
    idleTimer = IDLE_TIMEOUT_INTERACTION;
    if (activeGame === tl.propertiesIdentifier) {
        for (let i = 0; i < tl.cards.length; i++) {
            tl.cards[i].resetRotation(false);
        }
        clearSelectedCard();
    }
    if (activeGame === puz.propertiesIdentifier) {
        clearSelectedCard();
    }
    if (activeGame === col.propertiesIdentifier) {
        clearSelectedCard();
    }
}

function mouseReleased() {
    fullscreen(true);
    idleTimer = IDLE_TIMEOUT_INTERACTION;
    touchEnded();
}

function touchMoved(){
    fullscreen(true);
    idleTimer = IDLE_TIMEOUT_INTERACTION;
    touchStarted();
    if (isAnySelectedCard()) {
        if (activeGame === tl.propertiesIdentifier) {
            tl.selectedCard.posx = touchTargets[0].x;
            tl.selectedCard.posy = touchTargets[0].y;
        }
        if (activeGame === puz.propertiesIdentifier) {
            puz.selectedCard.posx = touchTargets[0].x;
            puz.selectedCard.posy = touchTargets[0].y;
        }

        if (activeGame === col.propertiesIdentifier) {
            col.selectedCard.posx = touchTargets[0].x;
            col.selectedCard.posy = touchTargets[0].y;
        }
    }
}

function mouseDragged() {
    fullscreen(true);
    idleTimer = IDLE_TIMEOUT_INTERACTION;
    touchMoved();
}

function touchStarted() {
    fullscreen(true);
    idleTimer = IDLE_TIMEOUT_INTERACTION;

    setTouchTargets();

    if (activeGame === tl.propertiesIdentifier) {
        // decide order of the cards based on mouseposition ------
        if (!isAnySelectedCard()) {
            for (let i = 0; i < tl.cards.length; i++) {
                let activeCard = tl.cards[i];
                if (activeCard.isActive(touchTargets[0].x, touchTargets[0].y)) {
                    tl.cards.splice(i, 1);
                    tl.cards.push(activeCard);
                    tl.selectedCard = activeCard;
                    // straighten the selected card
                    tl.selectedCard.resetRotation(true);
                }
            }
            // clear active pop-up if any.
            initHidePopUp(tl);
        }
        checkInfoPopUpClosed(tl);
    }

    if (activeGame === puz.propertiesIdentifier) {
        if (!isAnySelectedCard()) {
            for (let i = 0; i < puz.cards.length; i++) {
                let activeCard = puz.cards[i];
                if (activeCard.isActive(touchTargets[0].x, touchTargets[0].y)) {
                    puz.cards.splice(i, 1);
                    puz.cards.push(activeCard);
                    puz.selectedCard = activeCard;
                    // straighten the selected card
                    puz.selectedCard.resetRotation(true);
                }
            }
        }
    }

    if (activeGame === col.propertiesIdentifier) {
        if (!isAnySelectedCard()) {
            for (let i = 0; i < col.pieces.length; i++) {
                let activeCard = col.pieces[i];
                if (activeCard.isActive(touchTargets[0].x, touchTargets[0].y)) {
                    col.pieces.splice(i, 1);
                    col.pieces.push(activeCard);
                    col.selectedCard = activeCard;
                }
            }
        }
    }

}

// *************************************************************

document.addEventListener("gesturestart", function (e) {
    e.preventDefault();
    document.body.style.zoom = 0.99;
});

document.addEventListener("gesturechange", function (e) {
    e.preventDefault();

    document.body.style.zoom = 0.99;
});
document.addEventListener("gestureend", function (e) {
    e.preventDefault();
    document.body.style.zoom = 1;
});
