let score = 0;
        let collectedLetters = [];
        const totalLetters = 3;
        const lettersContent = [
            "Surat ke-1: Selamat ulang tahun, Pak Ridwan. Semoga sehat selalu, sukses terus, dan semakin bijak dalam setiap langkah",
            "Surat ke-2: Semangat Selalu Menjelanani Hari nya Pak Ridwan, aku bakal selalu ada buat kamu dan keluarga",
            "Surat ke-3: Walau Hidup Memang Berat, tatapi jangan pernah menyerah untuk mengajari hal baik kepada orang-orang di sekitarmu"
        ];
        let gameInterval;
        let hat = document.getElementById('hat');
        let scoreElement = document.getElementById('score');
        let letterButton = document.getElementById('letterButton');
        let letterIcon = letterButton.querySelector('.icon');
        let letterProgress = letterButton.querySelector('.progress');
        let letterModal = document.getElementById('letterModal');
        let collectedLettersDiv = document.getElementById('collectedLetters');

        document.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth) * 100;
            const mousePercentX = (e.clientX / window.innerWidth - 0.5) * 2;
            const mousePercentY = (e.clientY / window.innerHeight - 0.5) * 2;
            const rotateY = mousePercentX * 15;
            const rotateX = -25 - (mousePercentY * 10);
            hat.style.left = x + '%';
            hat.style.transform = `translateX(-50%) rotateX(${-rotateX}deg) rotateY(${rotateY + 180}deg) scaleY(-1) translateZ(0px)`;
        });


        // Touch support untuk mobile
        document.addEventListener('touchmove', (e) => {
            const touch = e.touches[0];
            const x = (touch.clientX / window.innerWidth) * 100;
            const mousePercentX = (touch.clientX / window.innerWidth - 0.5) * 2;
            const mousePercentY = (touch.clientY / window.innerHeight - 0.5) * 2;
            const rotateY = mousePercentX * 15;
            const rotateX = -25 - (mousePercentY * 10);
            hat.style.left = x + '%';
            hat.style.transform = `translateX(-50%) rotateX(${rotateX}deg) rotateY(${rotateY + 180}deg) scaleY(-1) translateZ(0px)`;
        });


        // Reset transform saat mouse leave
        document.addEventListener('mouseleave', () => {
            hat.style.transform = 'translateX(-50%) rotateX(25deg) rotateY(0deg) translateZ(0px)';
        });

        // Fungsi untuk efek blink pada topi
        function triggerHatBlink() {
            hat.classList.add('blink');
            setTimeout(() => {
                hat.classList.remove('blink');
            }, 300);
        }

        // Fungsi generate objek jatuh
        function createFallingObject(type, content = '') {
            const obj = document.createElement('div');
            obj.classList.add('falling-object');
            if (type === 'heart') {
                obj.innerHTML = '❤️';
                obj.classList.add('heart');
                document.getElementById('hearts').appendChild(obj);
            } else {
                const nextIndex = collectedLetters.length;
                if (nextIndex < totalLetters) {
                    obj.innerHTML = '';
                    obj.classList.add('letter');
                    obj.dataset.letterIndex = nextIndex;
                    obj.dataset.letterNum = nextIndex + 1;
                    document.getElementById('letters').appendChild(obj);
                }
            }

            // Posisi acak
            obj.style.left = Math.random() * 90 + '%';
            obj.style.animationDuration = (Math.random() * 3 + 4) + 's';

            // Deteksi collision dengan topi
            const checkCollision = setInterval(() => {
                if (obj.parentNode) {
                    const objRect = obj.getBoundingClientRect();
                    const hatRect = hat.getBoundingClientRect();
                    if (objRect.bottom >= hatRect.top && 
                        objRect.top <= hatRect.bottom &&
                        objRect.right >= hatRect.left && 
                        objRect.left <= hatRect.right) {
                        
                        // Efek masuk ke topi: Tambahkan class caught untuk animasi
                        obj.classList.add('caught');
                        
                        // Trigger blink pada topi
                        triggerHatBlink();
                        
                        // Delay sedikit untuk animasi selesai, lalu proses skor/surat
                        setTimeout(() => {
                            if (type === 'heart') {
                                score += 10;
                                updateScore();
                            } else {
                                const index = parseInt(obj.dataset.letterIndex);
                                if (index < totalLetters && !collectedLetters.includes(index)) {
                                    collectedLetters.push(index);
                                    updateScore();
                                    updateLetterButton();
                                }
                            }
                            obj.remove();
                        }, 500); // Sesuaikan dengan durasi animasi enterHat
                        
                        clearInterval(checkCollision);
                    }
                } else {
                    clearInterval(checkCollision);
                }
            }, 100);

            // Hapus setelah animasi selesai jika tidak tertangkap
            setTimeout(() => {
                if (obj.parentNode && !obj.classList.contains('caught')) {
                    obj.remove();
                }
                clearInterval(checkCollision);
            }, 7000);
        }

        // Update skor dan surat
        function updateScore() {
            scoreElement.textContent = `Skor: ${score} | Surat Terkumpul: ${collectedLetters.length}/${totalLetters}`;
            if (collectedLetters.length === totalLetters) {
                alert('Selamat! Kamu mengumpulkan semua surat!');
                clearInterval(gameInterval);
            }
        }

        // Update tombol surat
        function updateLetterButton() {
            const count = collectedLetters.length;
            letterProgress.textContent = `${count}/${totalLetters}`;
            if (count > 0) {
                letterButton.classList.remove('disabled');
                let labels = '';
                collectedLetters.forEach(index => {
                    labels += `Surat ke-${index + 1}, `;
                });
                labels = labels.slice(0, -2);
                if (labels.length > 20) labels = labels.substring(0, 20) + '...';
                letterButton.title = `Surat terkumpul: ${labels}`;
            } else {
                letterButton.classList.add('disabled');
                letterButton.title = 'Belum ada surat terkumpul';
            }
        }

        // Tampilkan modal surat
        letterButton.addEventListener('click', () => {
            if (collectedLetters.length > 0) {
                collectedLettersDiv.innerHTML = '';
                collectedLetters.forEach(index => {
                    const div = document.createElement('div');
                    div.classList.add('letter-item');
                    div.innerHTML = `
                        <h3>Surat ke-${index + 1}</h3>
                        <p>${lettersContent[index]}</p>
                    `;
                    collectedLettersDiv.appendChild(div);
                });
                letterModal.classList.add('show');
            } else {
                alert('Belum ada surat yang terkumpul! Tangkap surat yang jatuh terlebih dahulu.');
            }
        });

        // Tutup modal
        document.getElementById('closeModal').addEventListener('click', () => {
            letterModal.classList.remove('show');
        });

        letterModal.addEventListener('click', (e) => {
            if (e.target === letterModal) {
                letterModal.classList.remove('show');
            }
        });

        // Mulai game
        gameInterval = setInterval(() => {
            if (Math.random() < 0.7) {
                createFallingObject('heart');
            }
            if (collectedLetters.length < totalLetters && Math.random() < 0.3) {
                createFallingObject('letter');
            }
        }, 1500);

        // Inisialisasi
        updateLetterButton();