def split_string_on_lines(text, max_line_length=75):
    words = text.split()
    lines = []
    current_line = ''

    for word in words:
        # Check if adding the word to the current line exceeds the max line length
        if len(current_line) + len(word) + 1 <= max_line_length:
            # Add the word to the current line
            if current_line:
                current_line += ' '
            current_line += word
        else:
            # Start a new line with the current word
            lines.append(current_line)
            current_line = word

    # Add the last line
    if current_line:
        lines.append(current_line)

    return '"{}"'.format('"\n" +\n "'.join(lines))

# Example usage:
long_string = "Ion Țiriac s-a născut la câteva sute de metri de terenurile de tenis de la Olimpia, pe strada Cerbului. În noiembrie 1957, pe terenul de sub Tâmpa s-a desfășurat turneul de tenis de câmp al primilor opt jucători din lotul de tineret al României. „Surpriza turneului a fost tânărul Țiriac de la Energia Steagul Roșu” (din ziarul ,,Drum Nou”). În anul 1970, Ion Țiriac a câștigat împreună cu Ilie Năstase turneul de la Roland Garros. Apoi, avându-l partener tot pe Năstase, a jucat trei finale de Cupa Davis, toate cu Statele Unite ale Americii (1969, 1970 și 1972)."
formatted_text = split_string_on_lines(long_string)
print(formatted_text)