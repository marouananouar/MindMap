// script.js

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('mind-map-canvas');
    const ctx = canvas.getContext('2d');
    const popup = document.getElementById('popup');
    const popupTitle = document.getElementById('popup-title');
    const popupInfo = document.getElementById('popup-info');
    const popupLink = document.getElementById('popup-link');
    const closeBtn = document.querySelector('.close-btn');
    const resourcesDropdown = document.getElementById('resources');
    const signature = document.querySelector('.signature');
    const userLocation = document.querySelector('.user-info span:first-child');
    const currentTime = document.getElementById('current-time');
    const currentDate = document.getElementById('current-date');

    // Set user's location (replace with actual user location if known)
    userLocation.textContent = 'Location: Your Location'; // Replace with actual location

    // Function to update live time and date
    function updateTimeAndDate() {
        const now = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true };
        const formattedDate = now.toLocaleDateString('en-US', options);
        currentDate.textContent = formattedDate;
    }

    // Update time and date initially
    updateTimeAndDate();

    // Update time and date every second
    setInterval(updateTimeAndDate, 1000);

    canvas.width = window.innerWidth * 0.9;
    canvas.height = window.innerHeight * 2; // Adjust the height to ensure the content fits

    const nodes = [
        { id: 0, x: canvas.width / 2, y: 100, text: "Start", info: "This roadmap covers essential topics from networking basics to certifications, designed to guide you from beginner to advanced cybersecurity skills." },
        { id: 1, x: canvas.width / 2, y: 200, text: "Networking Basics", info: "Learn about TCP/IP, DNS, and HTTP.", link: "https://www.cloudflare.com/learning/network-layer/what-is-tcp-ip/" },
        { id: 2, x: canvas.width / 4, y: 300, text: "Linux Basics", info: "Learn basic Linux commands.", link: "https://www.tutorialspoint.com/unix/index.htm" },
        { id: 3, x: canvas.width * 3 / 4, y: 300, text: "Programming", info: "Learn Python, a popular language for cybersecurity.", link: "https://www.learnpython.org/" },
        { id: 4, x: canvas.width / 2, y: 400, text: "Web Security", info: "Learn about web vulnerabilities like XSS and SQL Injection.", link: "https://owasp.org/www-project-top-ten/" },
        { id: 5, x: canvas.width / 4, y: 500, text: "Ethical Hacking", info: "Learn about penetration testing.", link: "https://www.hackthebox.eu/" },
        { id: 6, x: canvas.width * 3 / 4, y: 500, text: "Security Tools", info: "Learn to use tools like Wireshark and Metasploit.", link: "https://www.wireshark.org/" },
        { id: 7, x: canvas.width / 2, y: 600, text: "Certifications", info: "Consider certifications like CEH, CISSP.", link: "https://www.isc2.org/Certifications/CISSP" },
        { id: 8, x: canvas.width / 4, y: 700, text: "Incident Response", info: "Learn how to respond to security incidents.", link: "https://www.sans.org/cyber-security-courses/incident-handling-incident-response/" },
        { id: 9, x: canvas.width * 3 / 4, y: 700, text: "Cryptography", info: "Learn about encryption and cryptographic algorithms.", link: "https://www.khanacademy.org/computing/computer-science/cryptography" },
        { id: 10, x: canvas.width / 2, y: 800, text: "Bug Bounty Programs", info: "Participate in bug bounty programs to find and report vulnerabilities.", link: "https://www.hackerone.com/" },
        { id: 11, x: canvas.width / 4, y: 900, text: "Penetration Testing", info: "Learn and practice penetration testing techniques.", link: "https://www.offensive-security.com/metasploit-unleashed/" },
        { id: 12, x: canvas.width * 3 / 4, y: 900, text: "Ethical Hacking", info: "Explore ethical hacking methodologies and practices.", link: "https://www.eccouncil.org/programs/certified-ethical-hacker-ceh/" },
        { id: 13, x: canvas.width / 4, y: 1000, text: "Networking", info: "Master networking fundamentals for cybersecurity.", link: "https://www.cisco.com/c/en/us/training-events/training-certifications.html" },
        { id: 14, x: canvas.width * 3 / 4, y: 1000, text: "Programming", info: "Enhance programming skills relevant to cybersecurity.", link: "https://www.codingdojo.com/blog/5-programming-languages-for-cyber-security" },
        { id: 15, x: canvas.width / 2, y: 1100, text: "Advanced Certifications", info: "Pursue advanced certifications such as CISSP.", link: "https://www.isc2.org/Certifications/CISSP" },
        { id: 16, x: canvas.width / 4, y: 1200, text: "Further Resources", info: "Explore additional resources to deepen your cybersecurity knowledge.", link: "#" },
    ];

    const connections = [
        { from: 0, to: 1 },
        { from: 1, to: 2 },
        { from: 1, to: 3 },
        { from: 3, to: 4 },
        { from: 4, to: 5 },
        { from: 4, to: 6 },
        { from: 5, to: 10 },
        { from: 5, to: 11 },
        { from: 5, to: 12 },
        { from: 6, to: 7 },
        { from: 4, to: 13 },
        { from: 14, to: 15 },
        { from: 16, to: 7 },
    ];

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawConnections();
        drawNodes();
    }

    function drawNodes() {
        ctx.font = '24px Arial';
        ctx.textAlign = 'center';

        nodes.forEach(node => {
            ctx.beginPath();
            ctx.arc(node.x, node.y, 30, 0, 2 * Math.PI);
            ctx.fillStyle = '#3498db';
            ctx.fill();
            ctx.stroke();
            ctx.fillStyle = '#ffffff';
            ctx.fillText(node.text, node.x, node.y - 40);
        });
    }

    function drawConnections() {
        connections.forEach(connection => {
            const fromNode = nodes.find(node => node.id === connection.from);
            const toNode = nodes.find(node => node.id === connection.to);
            if (fromNode && toNode) {
                ctx.beginPath();
                ctx.moveTo(fromNode.x, fromNode.y);
                ctx.lineTo(toNode.x, toNode.y);
                ctx.strokeStyle = '#34495e';
                ctx.lineWidth = 3;
                ctx.stroke();
            }
        });
    }

    function showPopup(node) {
        popupTitle.textContent = node.text;
        popupInfo.textContent = node.info;
        popupLink.href = node.link || '#'; // Handle cases where link might be undefined
        popup.style.display = 'block';
    }

    closeBtn.addEventListener('click', () => {
        popup.style.display = 'none';
    });

    resourcesDropdown.addEventListener('change', () => {
        const selectedOption = resourcesDropdown.value;
        if (selectedOption !== '#') {
            window.open(selectedOption, '_blank');
        }
    });

    canvas.addEventListener('click', (event) => {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const clickedNode = nodes.find(node => Math.hypot(node.x - x, node.y - y) < 30);

        if (clickedNode) {
            showPopup(clickedNode);
        }
    });

    // Signature Animation
    let signaturePosition = 0;
    setInterval(() => {
        signature.style.transform = `translateY(${signaturePosition}px)`;
        signaturePosition = (signaturePosition + 1) % 10; // Adjust speed and range as needed
    }, 100); // Adjust animation speed as needed

    draw();

    // Responsive Canvas Resizing
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth * 0.9;
        canvas.height = window.innerHeight * 2; // Adjust the height to ensure the content fits
        draw();
    });
	
	
});
