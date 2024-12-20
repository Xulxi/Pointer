// bit 0, pointer +, state 6
// [ BitToken, NumberToken, CommaToken, PointerToken, StateToken ]

export enum TokenType {
    Number,
    Direction,

    Comma,

    Bit,
    Pointer,
    State,
    EOF,
}

const KEYWORDS: Record<string, TokenType> = {
    "bit": TokenType.Bit,
    "pointer": TokenType.Pointer,
    "state": TokenType.State,
};

export interface Token {
    value: string,
    type: TokenType
}

function token(value = "", type: TokenType): Token {
    return {value, type};
}

function isAlpha(src: string) {
    return src.toUpperCase() != src.toLowerCase();
}

function isSkippable(str: string) {
    return str == " " || str == "\n" || str == "\t";
}

function isInt(str: string) {
    const c = str.charCodeAt(0);
    const bounds = ["0".charCodeAt(0), "9".charCodeAt(0)];
    return (c >= bounds[0] && c <= bounds[1]);
}

export function tokenize(sourceCode: string): Token[] {
    const tokens = new Array<Token>();
    const src = sourceCode.split("");

    // Build each token until end of file
    while (src.length > 0) {
        if (src[0] == ",") {
            tokens.push(token(src.shift(), TokenType.Comma));
        } else if (src[0] == "+" || src[0] == "-") {
            tokens.push(token(src.shift(), TokenType.Direction));
        } else {
            // Handle multi-character tokens

            // Build number token
            if (isInt(src[0])) {
                let num = "";
                while (src.length > 0 && isInt(src[0])) {
                    num += src.shift();
                }

                tokens.push(token(num, TokenType.Number));
            } else if (isAlpha(src[0])) {
                let ident = "";
                while (src.length > 0 && isAlpha(src[0])) {
                    ident += src.shift();
                }

                // Check for reserved keywords
                const reserved = KEYWORDS[ident];
                if (reserved == undefined) {
                    // PUSH NOTHING
                } else {
                    tokens.push(token(ident, reserved));
                }
            } else if (isSkippable(src[0])) {
                src.shift(); // SKIP THE CURRENT CHARACTER
            } else {
             console.log("Unrecognised character found in source: ", src[0]);
             Deno.exit(1);
            }
        }
    }

    tokens.push({type: TokenType.EOF, value: "EndOfFile"});
    return tokens;
}


const source = await Deno.readTextFile("./test.txt");
for (const token of tokenize(source)) {
    console.log(token);
}