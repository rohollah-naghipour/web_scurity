 // Character counter for textarea
        document.addEventListener('DOMContentLoaded', function() {
            const textarea = document.querySelector('textarea');
            if (textarea) {
                const counter = document.createElement('div');
                counter.className = 'char-counter';
                counter.textContent = '0 character';
                textarea.parentNode.appendChild(counter);

                textarea.addEventListener('input', function() {
                    const length = this.value.length;
                    counter.textContent = length + ' character' + (length !== 1 ? 's' : '');
                });
            }

            // Real-time validation
            const inputs = document.querySelectorAll('input, textarea');
            inputs.forEach(input => {
                input.addEventListener('blur', function() {
                    if (this.value.trim() === '') {
                        this.parentElement.classList.add('error');
                    } else {
                        this.parentElement.classList.remove('error');
                        this.parentElement.classList.add('success');
                    }
                });
            });
        });