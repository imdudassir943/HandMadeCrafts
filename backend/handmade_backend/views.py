from django.http import HttpResponse

def home_view(request):
    html_content = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HandMadeCrafts Backend API</title>
    <style>
        /* Django Admin Style Palette */
        :root {
            --primary: #0c4c3d;
            --primary-dark: #083329;
            --accent: #417690;
            --accent-dark: #2b5269;
            --bg-gray: #f8f9fa;
            --text-dark: #333333;
            --text-light: #666666;
            --border-color: #e0e0e0;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            background-color: var(--bg-gray);
            color: var(--text-dark);
            margin: 0;
            padding: 0;
            display: flex;
            flex-direction: column;
            min-height: 100vh;
        }

        /* Header Bar mimicking Django Admin header */
        header {
            background-color: var(--primary);
            color: #ffffff;
            padding: 15px 40px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        header h1 {
            margin: 0;
            font-size: 20px;
            font-weight: 500;
            letter-spacing: 0.5px;
        }

        header h1 a {
            color: #ffffff;
            text-decoration: none;
        }

        header .branding {
            color: #ffc75f;
            font-weight: bold;
            font-size: 14px;
            text-transform: uppercase;
        }

        /* Main container mimicking Django Admin login / info card */
        main {
            flex: 1;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
        }

        .card {
            background: #ffffff;
            border: 1px solid var(--border-color);
            border-radius: 4px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
            max-width: 500px;
            width: 100%;
            padding: 40px;
            text-align: center;
        }

        .logo-container {
            margin-bottom: 25px;
        }

        .logo-django {
            font-size: 32px;
            font-weight: bold;
            color: var(--primary);
            letter-spacing: -1px;
        }

        .logo-django span {
            color: var(--accent);
        }

        h2 {
            font-size: 22px;
            margin-top: 0;
            margin-bottom: 15px;
            font-weight: 500;
            color: var(--primary);
        }

        p {
            font-size: 15px;
            line-height: 1.6;
            color: var(--text-light);
            margin-bottom: 30px;
        }

        /* Action Button matching Django Admin primary buttons */
        .btn-admin {
            display: inline-block;
            background-color: var(--accent);
            color: #ffffff;
            text-decoration: none;
            padding: 12px 24px;
            font-size: 15px;
            font-weight: 500;
            border-radius: 4px;
            transition: background-color 0.2s ease, transform 0.1s ease;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .btn-admin:hover {
            background-color: var(--accent-dark);
        }

        .btn-admin:active {
            transform: scale(0.98);
        }

        footer {
            text-align: center;
            padding: 20px;
            font-size: 13px;
            color: var(--text-light);
            border-top: 1px solid var(--border-color);
            background-color: #ffffff;
        }

        footer a {
            color: var(--accent);
            text-decoration: none;
        }

        footer a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>

    <header>
        <h1><a href="/">HandMadeCrafts Administration</a></h1>
        <div class="branding">Django Backend Service</div>
    </header>

    <main>
        <div class="card">
            <div class="logo-container">
                <div class="logo-django">django<span> Admin Portal</span></div>
            </div>
            <h2>API Gateway & Management</h2>
            <p>
                Welcome to the HandMadeCrafts server. This instance serves the REST API, handles payment processing, manages products, and coordinates orders. For administrative data editing and system controls, please access the administration panel below.
            </p>
            <a href="/admin/" class="btn-admin">Go to Django Admin Panel</a>
        </div>
    </main>

    <footer>
        Powered by <a href="https://www.djangoproject.com/" target="_blank" rel="noopener">Django</a>. HandMadeCrafts &copy; 2026.
    </footer>

</body>
</html>
"""
    return HttpResponse(html_content)
