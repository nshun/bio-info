class Alignment {
    constructor(a, b) {
        this.a = a ? a : [];
        this.b = b ? b : [];
    }
}

const addAlignment = async (alignments, aliNum, cell, dnas) => {
    if (!cell.origins) return;
    const tasks = [];
    const origins = cell.origins;
    const oldAlignment = new Alignment(alignments[aliNum].a, alignments[aliNum].b);
    for (let i = 0; i < origins.length; i++) {
        if (1 < origins.length) {
            console.log();
        }
        const origin = origins[i];
        if (i === 0) {
            alignments[aliNum].a.unshift(cell.row !== origin.row ? dnas.a[origin.row] : '-');
            alignments[aliNum].b.unshift(cell.col !== origin.col ? dnas.b[origin.col] : '-');
            tasks.push(addAlignment(alignments, aliNum, origin, dnas));
        } else {
            alignments.push(new Alignment(oldAlignment.a, oldAlignment.b));
            const aliNum = alignments.length - 1;
            alignments[aliNum].a.unshift(cell.row !== origin.row ? dnas.a[origin.row] : '-');
            alignments[aliNum].b.unshift(cell.col !== origin.col ? dnas.b[origin.col] : '-');
            tasks.push(addAlignment(alignments, aliNum, origin, dnas));
        }
    }
    return tasks;
}

const make = async (data) => {
    const alignments = [];
    let row = data.table.length - 1;
    let col = data.table[0].length - 1;
    alignments.push(new Alignment());
    await addAlignment(alignments, 0, data.table[row][col], data.dnas);
    console.log(alignments);
    // return alignments;
}

module.exports = make;
