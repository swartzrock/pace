

export class StringBuffer {
    buf = ''

    add(s: string) {
        this.buf = this.buf + s
    }

    newline() {
        this.add('\n')
    }

    toString(): string {
        return this.buf
    }

    fillString(fill: string, length: number) {
        return ''.padStart(length, fill)
    }
}
