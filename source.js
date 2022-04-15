// Ugly switch case defining all templates, because this is a hobby project and I'm trying not to overthink this.
const getCharacterTemplate = character => {
    switch (character.toUpperCase()) {
        case 'A':
            return [
                '┌─┐',
                '├─┤',
                '╽ ╽',
            ];
        case 'B':
            return [
                '┌─┐',
                '├─┤',
                '└─┘',
            ];
        case 'C':
            return [
                '┌─╼',
                '│  ',
                '└─╼',
            ];
        case 'D':
            return [
                '┌─┐',
                '│ │',
                '└─┘',
            ];
        case 'E':
            return [
                '┌─╼',
                '├─╼',
                '└─╼',
            ];
        case 'F':
            return [
                '┌─╼',
                '├─╼',
                '╽  ',
            ];
        case 'G':
            return [
                '┌─┐',
                '│╾┐',
                '└─┘',
            ];
        case 'H':
            return [
                '╿ ╿',
                '├─┤',
                '╽ ╽',
            ];
        case 'I':
            return [
                ' ╿ ',
                ' │ ',
                ' ╽ ',
            ];
        case 'J':
            return [
                '  ╿',
                '  │',
                '╾─┘',
            ];
        case 'K': // Ugly, but we need diagonals otherwise.
            return [
                '┌─╼',
                '├─┐',
                '╽ ╽',
            ];
        case 'L':
            return [
                '╿  ',
                '│  ',
                '└─╼',
            ];
        case 'M':
            return [
                '┌┬┐',
                '│││',
                '╽╽╽',
            ];
        case 'N':
            return [
                '┌─┐',
                '│ │',
                '╽ ╽'
            ];
        case 'O':
            return [
                '┌─┐',
                '│ │',
                '└─┘',
            ];
        case 'P':
            return [
                '┌─┐',
                '├─┘',
                '╽  ',
            ];
        case 'Q':
            return [
                '┌─┐',
                '│ │',
                '└─┘',
            ];
        case 'R':
            return [
                '┌─┐',
                '├─┤',
                '╽ ╽',
            ];
        case 'S':
            return [
                '┌─╼',
                '└─┐',
                '╾─┘',
            ];
        case 'T':
            return [
                '╾┬╼',
                ' │ ',
                ' ╽ ',
            ];
        case 'U':
            return [
                '╿ ╿',
                '│ │',
                '└─┘',
            ];
        case 'V':
            return [
                '╿ ╿',
                '│ │',
                '└─┘'
            ];
        case 'W':
            return [
                '╿╿╿',
                '│││',
                '└┴┘'
            ];
        case 'X':
            return [
                ' ╿ ',
                '╾┼╼',
                ' ╽ ',
            ];
        case 'Y':
            return [
                '╿ ╿',
                '└┬┘',
                ' ╽ ',
            ];
        case 'Z':
            return [
                '╾─┐',
                '┌─┘',
                '└─╼',
            ];   
        default:
            console.log("Character '" + character + "' not supported, skipped.");
            return [];
    }
}

// Pass the form data and this gives you a method that will convert templates using the provided emoji codes.
const buildTemplateConverter = form_data => {
    const empty = form_data.get('empty') ?? ':empty:';
    const hor_left = form_data.get('hor-left') ?? ':hor_left:';
    const hor_middle = form_data.get('hor-middle') ?? ':hor_middle:';
    const hor_right = form_data.get('hor-right') ?? ':hor_right:';
    const ver_top = form_data.get('ver-top') ?? ':ver_top:';
    const ver_middle = form_data.get('ver-middle') ?? ':ver_middle:';
    const ver_bottom = form_data.get('ver-bottom') ?? ':ver_bottom:';
    const link_left = form_data.get('link-left') ?? ':link_left:';
    const link_top = form_data.get('link-top') ?? ':link_top:';
    const link_right = form_data.get('link-right') ?? ':link_right:';
    const link_bottom = form_data.get('link-bottom') ?? ':link_bottom:';
    const corner_top_right = form_data.get('corner-top-right' ?? ':corner_top_right:');
    const corner_top_left = form_data.get('corner-top-left') ?? ':corner_top_left:';
    const corner_bottom_right = form_data.get('corner-bottom-right') ?? ':cornet_bottom_right:';
    const corner_bottom_left = form_data.get('corner-bottom-left') ?? ':corner_bottom_left:';
    const cross = form_data.get('cross') ?? ':cross:';

    // Define the mapping for characters.
    const replacement_map = {
        ' ': empty,
        '╾': hor_left,
        '─': hor_middle,
        '╼': hor_right,
        '╿': ver_top,
        '│': ver_middle,
        '╽': ver_bottom,
        '┤': link_left,
        '┴': link_top,
        '├': link_right,
        '┬': link_bottom,
        '┌': corner_top_right,
        '┐': corner_top_left,
        '└': corner_bottom_right,
        '┘': corner_bottom_left,   
        '┼': cross, 
    };

    const convertTemplate = template => {
        let replaced_lines = [];
        for (let index = 0; index < template.length; index++) {
            let line = template[index];
            for (const [key, value] of Object.entries(replacement_map)) {
                line = line.replaceAll(key, value);
            }
            replaced_lines.push(line);
        }
        return replaced_lines;
    }

    return {
        convertTemplate
    }
}

// Main method processing the form and doing the work.
const processForm = form => {
    const form_data = new FormData(form);
    const input_text = form_data.get('input');
    const converter = buildTemplateConverter(form_data);
    
    // Get all required letter blocks.
    let letter_blocks = [];
    for (let index = 0; index < input_text.length; index++) {
        const block = getCharacterTemplate(input_text[index]);

        // Replace characters in template.
        if (block.length > 0) {
            letter_blocks.push(converter.convertTemplate(block));
        }
    }

    // Loop over all lines, for each block. If a block has no line, quit.
    let output_text = '';
    let row = 0;
    let rows_left = true;
    while(rows_left) {
    	let output_row = '';
        for (let block_num = 0; block_num < letter_blocks.length; block_num++) {
            let block = letter_blocks[block_num];
            if (row >= block.length) {
                rows_left = false;
                break;
            }
            output_row += block[row];
        }
        
        // If nothing was added, we don't really have a row.
        if (output_row.length > 0) {
            output_text += output_row + '\n';
        }
        
        row++;
    }

    // Set output text in field.
    document.getElementById('output').value = output_text;
};

