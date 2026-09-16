const users = [
    {
        username: "aryan",
        name: "Aryan",
        headline: "Full Stack Developer",
        location: "Bengaluru, India",
        connections: 500,
        profileImage: "/aryan_profile.jpg",
        coverImage: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=80",
        skills: ["React", "Node.js", "Express", "MongoDB"],
        
        followers: 1240,
        openToWork: true,
        about: "Passionate Full Stack Developer with experience in building scalable web applications. I love working with JavaScript technologies like React and Node.js.",
        experience: [
            {
                company: "Tech Solutions Inc.",
                role: "Senior Software Engineer",
                duration: "Jan 2022 - Present",
                description: "Developing robust back-end APIs and responsive front-end applications."
            }
        ],
        education: [
            {
                college: "Engineering College of Bengaluru",
                degree: "B.Tech in Computer Science",
                year: "2015 - 2019"
            }
        ],
        contact: {
            email: "aryan@example.com",
            phone: "+91-9876543210",
            linkedin: "https://linkedin.com/in/aryan"
        }
    },
    {
        username: "john",
        name: "John Anderson",
        headline: "UI/UX Designer",
        location: "New York, USA",
        connections: 850,
        profileImage: "https://randomuser.me/api/portraits/men/75.jpg",
        coverImage: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
        skills: ["Figma", "Adobe XD", "Photoshop"],

        followers: 890,
        openToWork: false,
        about: "Creative UI/UX Designer dedicated to building intuitive and visually appealing digital experiences.",
        experience: [
            {
                company: "Creative Agency",
                role: "Lead Designer",
                duration: "Mar 2020 - Present",
                description: "Leading the design team to deliver high-quality user interfaces for various clients."
            }
        ],
        education: [
            {
                college: "New York School of Design",
                degree: "BFA in Graphic Design",
                year: "2016 - 2020"
            }
        ],
        contact: {
            email: "john.design@example.com",
            phone: "+1-555-0192",
            linkedin: "https://linkedin.com/in/johnanderson"
        }
    },
    {
        username: "emma",
        name: "Emma Wilson",
        headline: "Data Analyst",
        location: "London, UK",
        connections: 1200,
        profileImage: "https://randomuser.me/api/portraits/women/68.jpg",
        coverImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
        skills: ["Python", "SQL", "Power BI"],

        followers: 1560,
        openToWork: true,
        about: "Detail-oriented Data Analyst with a knack for turning complex data sets into actionable insights.",
        experience: [
            {
                company: "Data Insights Ltd.",
                role: "Data Analyst",
                duration: "Sep 2021 - Present",
                description: "Analyzing large datasets and creating interactive dashboards to support business decisions."
            }
        ],
        education: [
            {
                college: "University of London",
                degree: "BSc in Statistics",
                year: "2017 - 2021"
            }
        ],
        contact: {
            email: "emma.data@example.com",
            phone: "+44-7700-900077",
            linkedin: "https://linkedin.com/in/emmawilson"
        }
    }
];

module.exports = users;
