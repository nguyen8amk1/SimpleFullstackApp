// Input: the html file 
// Output: schedule object
const fs = require('fs');
const cheerio = require('cheerio');

const SERIOUS_COLORS = [11, 6, 4, 5, 3, 7, 1, 9, 2, 10, 8];
/* const SERIOUS_COLORS = { */
/*     RED: 11, */
/*     ORANGE: 6, */
/*     PALE_RED: 4, */
/*     YELLOW: 5, */
/*     MAUVE: 3, */
/*     CYAN: 7, */
/*     PALE_BLUE: 1, */
/*     BLUE: 9, */
/*     PALE_GREEN: 2, */
/*     GREEN: 10, */
/*     GRAY: 8, */
/* }; */

// NOTE: tiet starting from 0, to exclusive n, meaning -1 from the real tiet 
const tietStartTimeMapping = ["07:30:00", "08:15:00", "09:00:00", "10:00:00", "10:45:00", "13:00:00", "13:45:00", "14:30:00", "15:30:00", "16:15:00"]; 
const tietEndMapping =       ["08:15:00", "09:00:00", "09:45:00", "10:45:00", "11:30:00", "13:45:00", "14:30:00", "15:15:00", "16:15:00", "17:00:00" ]; 

class HTMLCalendarParser {
    constructor() {
        this.data = null;
    }


    _parseSubjectInformationFromHTML(htmlString) {
        const textArray = htmlString.split('<br>');
        const cleanedTextArray = textArray.map(item => item.trim());
        const finalTextArray = cleanedTextArray.filter(item => item !== '')
        return finalTextArray;
    }

    _generateTKB($, selectorTKBTable, allTrs) {
        const tkb = [];
        allTrs.each((index, element) => {
            const alltds = $(`${selectorTKBTable} > tbody > tr:nth-child(${index + 1}) > td`);
            const newArray = [];
            tkb.push(newArray);

            let colorIndex = 0;
            alltds.each((tdindex, td) => {
                const ystart = index;
                const yend = ystart + parseInt($(td).attr("rowspan"));
                const mamon = $(td).children("strong");

                let name = "";
                let startDate = "";
                let endDate = "";
                let startTime = "";
                let endTime = "";
                let gap = "";
                let description = "";
                let color; 

                let good = 0;
                if(mamon.length > 0)  {
                    const htmlString = $(td).html();
                    const parsedSubjectInfo = this._parseSubjectInformationFromHTML(htmlString); 

                    if(parsedSubjectInfo.length == 6) {
                        //console.log(parsedSubjectInfo);
                        //console.log(mamon.text());

                        name = `${parsedSubjectInfo[2]} - ${mamon.text()}`; // ten + mamon

                        const dateExtractFromString = (inputString) => {
                            const colonIndex = inputString.indexOf(':');
                            const dateInformation = inputString.slice(colonIndex + 1);
                            return dateInformation;
                        }

                        startDate = dateExtractFromString(parsedSubjectInfo[4]);
                        endDate = dateExtractFromString(parsedSubjectInfo[5]);


                        startTime = tietStartTimeMapping[ystart]; // 
                        endTime = tietEndMapping[yend-1]; // 

                        const extractGapFromMaMon = (inputString) => {
                            const regex = /\(Cách (\d+) tuần\)/;
                            const match = inputString.match(regex);

                            if (match && match[1]) {
                                return parseInt(match[1], 10);
                            } else {
                                return 1;
                            }
                        }

                        gap = extractGapFromMaMon(mamon.text());
                        description = `${parsedSubjectInfo[3]} - ${mamon.text()} - ${parsedSubjectInfo[1]}`; // phong hoc 3 + si so 1

                        color = SERIOUS_COLORS[colorIndex]; 

                        good = 1 && startTime && endTime; 
                        colorIndex++;
                    }

                }


                newArray.push({
                    // NOTE: these 3 information are for booleanTable calculation 
                    good: good, 

                    ystart: ystart, 
                    yend: yend, 

                    // NOTE: the information from now on is not related to the upper one 
                    name: name,
                    startDate: startDate,
                    endDate: endDate,

                    startTime: startTime,
                    endTime: endTime,

                    gap: gap,
                    description: description,
                    color: color,
                });
            });
        });

        return tkb;
    }

    _generateEventFromTKB(tkb) {
        const booleanTable = Array.from({ length: 11 }, () => Array(6).fill(1));
        const fillFromTo = (booleanTable, i, from, to) => {
            for(let j = from; j < to; j++) {
                booleanTable[j][i] = 0; 
            }
        }

        const fillBooleanTableAccordingToTKB = () => {
            for(let i = 0; i < booleanTable.length; i++) {
                let x = 0; 
                let previousX = -1; 
                for(let j = 0; j < booleanTable[i].length; j++) {
                    x += booleanTable[i][j]; 
                    if(x !== previousX) {
                        const subject = tkb[i][x];

                        if(subject && subject.good) {
                            subject.weekday = j + 2; 
                            fillFromTo(booleanTable, j, subject.ystart, subject.yend);
                        }
                        previousX = x; 
                    }
                }
            }
        }

        fillBooleanTableAccordingToTKB();
        const finalResults = [];
        for(let i = 0; i < tkb.length; i++) {
            for(let j = 0; j < tkb[i].length; j++) {
                if(tkb[i][j].good) { 
                    delete tkb[i][j].good; 
                    delete tkb[i][j].ystart; 
                    delete tkb[i][j].yend; 
                    finalResults.push(tkb[i][j]); 
                } 
            }
        }
        return finalResults; 
    }


    _generateEventFromTkbHTML(tkbhtmlPath) {
        const html = fs.readFileSync(tkbhtmlPath, 'utf-8');
        const $ = cheerio.load(html);

        const selectorTKBTable = '#uit-tracuu-tkb-data > div > table.sticky-enabled.tableheader-processed.sticky-table';
        const allTrs = $(`${selectorTKBTable} > tbody tr`);

        const tkb = this._generateTKB($, selectorTKBTable, allTrs);
        const finalResults = this._generateEventFromTKB(tkb);
        return finalResults;
    }


    setData(data) {
        // TODO: data type checking 
        this.data = data; 
    }

    parse() {
        //const tkbhtmlPath = "tkbhk1.html";
        if(!this.data) throw new Error("There are not data to parse");
        const result = this._generateEventFromTkbHTML(this.data);
        return result;
    }
}

class InHouseFormatCalendarParser {
    constructor() {
        this.data = null;
    }

    setData(data) {
        this.data = data; 
    }

    parse() {
        // TODO: 

    }

}

module.exports = { HTMLCalendarParser, InHouseFormatCalendarParser}; 
