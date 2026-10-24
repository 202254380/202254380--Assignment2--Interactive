var currentDirectory = Directory.GetCurrentDirectory();
var siteRoot = File.Exists(Path.Combine(currentDirectory, "index.html"))
    ? currentDirectory
    : Path.GetFullPath(Path.Combine(currentDirectory, ".."));
if (!File.Exists(Path.Combine(siteRoot, "index.html")))
{
    throw new DirectoryNotFoundException("Run the server from the project folder or its server folder.");
}
var builder = WebApplication.CreateBuilder(new WebApplicationOptions
{
    Args = args,
    ContentRootPath = siteRoot,
    WebRootPath = siteRoot
});
var app = builder.Build();

string[] trainingTips =
[
    "Control every repetition and prioritize good form over heavier weight.",
    "Record your workouts so you can improve one small detail next time.",
    "Recovery matters: sleep, hydration, and nutrition support your training.",
    "Warm up gradually before your hardest working sets."
];

app.UseDefaultFiles();
app.UseStaticFiles();

app.MapGet("/api/tip", () => Results.Ok(new
{
    tip = trainingTips[Random.Shared.Next(trainingTips.Length)]
}));

app.Run("http://localhost:5051");
